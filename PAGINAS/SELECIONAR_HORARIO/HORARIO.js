import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, database } from '../../firebaseConfig';
import styles from './style';

const nomesMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const diasDaSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const horarios = Array.from({ length: 13 }, (_, index) => (
  `${String(index + 8).padStart(2, '0')}:00`
));

function criarDataLocal(ano, mes, dia) {
  return new Date(ano, mes, dia);
}

function formatarData(data) {
  return [
    String(data.getDate()).padStart(2, '0'),
    String(data.getMonth() + 1).padStart(2, '0'),
    data.getFullYear(),
  ].join('/');
}

function criarChaveData(data) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function SelecionarHorario({ navigation, route }) {
  const fluxoAdministrador = route?.params?.returnRoute === 'TelaInicialAdm';
  const telaRetorno = fluxoAdministrador
    ? 'TelaInicialAdm'
    : 'Tarefas';
  const hoje = criarDataLocal(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [mesExibido, setMesExibido] = useState(
    criarDataLocal(hoje.getFullYear(), hoje.getMonth(), 1),
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [nomeCliente, setNomeCliente] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendaSuspensa, setAgendaSuspensa] = useState(false);
  const [dataAgendamentosCarregada, setDataAgendamentosCarregada] = useState(null);
  const [dataSuspensaoCarregada, setDataSuspensaoCarregada] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const chaveData = criarChaveData(dataSelecionada);
  const dadosCarregados = (
    dataAgendamentosCarregada === chaveData
    && dataSuspensaoCarregada === chaveData
  );
  const barbeiroId = route?.params?.barbeiroSelecionadoId;
  const horarioOcupado = agendamentos.some((agendamento) => (
    agendamento.idBarbeiro === barbeiroId
    && agendamento.horario === horarioSelecionado
  ));

  const primeiroDiaDoMes = mesExibido.getDay();
  const quantidadeDeDias = new Date(
    mesExibido.getFullYear(),
    mesExibido.getMonth() + 1,
    0,
  ).getDate();
  const diasDoMes = [
    ...Array(primeiroDiaDoMes).fill(null),
    ...Array.from({ length: quantidadeDeDias }, (_, index) => index + 1),
  ];
  const mesAnteriorDisponivel = (
    mesExibido.getFullYear() > hoje.getFullYear()
    || (
      mesExibido.getFullYear() === hoje.getFullYear()
      && mesExibido.getMonth() > hoje.getMonth()
    )
  );

  useEffect(() => {
    setDataAgendamentosCarregada(null);
    setDataSuspensaoCarregada(null);
    setMensagemErro('');

    const consultaAgendamentos = query(
      collection(database, 'agendamentos'),
      where('data', '==', chaveData),
    );
    const cancelarAgendamentos = onSnapshot(
      consultaAgendamentos,
      (snapshot) => {
        setAgendamentos(snapshot.docs.map((agendamentoDoc) => ({
          id: agendamentoDoc.id,
          ...agendamentoDoc.data(),
        })));
        setDataAgendamentosCarregada(chaveData);
      },
      (error) => {
        console.error('Erro ao carregar horários agendados:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar os horários agendados.'
            : 'Não foi possível consultar os horários. Verifique sua conexão e tente novamente.',
        );
        setDataAgendamentosCarregada(chaveData);
      },
    );
    const cancelarSuspensao = onSnapshot(
      doc(database, 'agendasSuspensas', chaveData),
      (snapshot) => {
        setAgendaSuspensa(snapshot.exists());
        setDataSuspensaoCarregada(chaveData);
      },
      (error) => {
        console.error('Erro ao consultar a suspensão da agenda:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar a disponibilidade da agenda.'
            : 'Não foi possível consultar a disponibilidade. Verifique sua conexão e tente novamente.',
        );
        setDataSuspensaoCarregada(chaveData);
      },
    );

    return () => {
      cancelarAgendamentos();
      cancelarSuspensao();
    };
  }, [chaveData]);

  function alterarMes(deslocamento) {
    setMesExibido((mesAtual) => criarDataLocal(
      mesAtual.getFullYear(),
      mesAtual.getMonth() + deslocamento,
      1,
    ));
  }

  function selecionarDia(dia) {
    if (dia === null) return;

    const novaData = criarDataLocal(
      mesExibido.getFullYear(),
      mesExibido.getMonth(),
      dia,
    );
    if (novaData < hoje) return;

    setDataSelecionada(novaData);
    setHorarioSelecionado(null);
    setNomeCliente('');
  }

  async function confirmarAgendamento() {
    const nomeClienteNormalizado = fluxoAdministrador
      ? nomeCliente.trim()
      : auth.currentUser?.displayName?.trim()
        || auth.currentUser?.email
        || 'Cliente';

    if (!horarioSelecionado || !barbeiroId || !route?.params?.servicoSelecionadoId) {
      setMensagemErro('Selecione um serviço, barbeiro e horário antes de continuar.');
      return;
    }
    if (fluxoAdministrador && !nomeClienteNormalizado) {
      setMensagemErro('Digite o nome do cliente.');
      return;
    }
    if (agendaSuspensa || horarioOcupado || !dadosCarregados) {
      setMensagemErro(
        agendaSuspensa
          ? 'A agenda está suspensa nesta data.'
          : 'Este horário não está disponível. Selecione outro.',
      );
      return;
    }

    setSalvando(true);
    setMensagemErro('');
    const idAgendamento = encodeURIComponent(
      `${chaveData}_${barbeiroId}_${horarioSelecionado.replace(':', '-')}`,
    );
    const referenciaAgenda = doc(database, 'agendasSuspensas', chaveData);
    const referenciaAgendamento = doc(database, 'agendamentos', idAgendamento);

    try {
      await runTransaction(database, async (transacao) => {
        const suspensao = await transacao.get(referenciaAgenda);
        if (suspensao.exists()) {
          throw new Error('AGENDA_SUSPENSA');
        }

        const agendamentoExistente = await transacao.get(referenciaAgendamento);
        if (agendamentoExistente.exists()) {
          throw new Error('HORARIO_OCUPADO');
        }

        transacao.set(referenciaAgendamento, {
          data: chaveData,
          horario: horarioSelecionado,
          nomeCliente: nomeClienteNormalizado,
          idUsuario: route?.params?.idUser || auth.currentUser?.uid || null,
          idBarbeiro: barbeiroId,
          nomeBarbeiro: route?.params?.barbeiroNome || '',
          idServico: route.params.servicoSelecionadoId,
          nomeServico: route?.params?.servicoNome || '',
          criadoEm: serverTimestamp(),
        });
      });

      navigation.navigate(telaRetorno, {
        idUser: route?.params?.idUser,
      });
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      if (error.message === 'AGENDA_SUSPENSA') {
        setAgendaSuspensa(true);
        setMensagemErro('A agenda está suspensa nesta data. Não é possível agendar.');
      } else if (error.message === 'HORARIO_OCUPADO') {
        setMensagemErro('Este horário acabou de ser reservado. Selecione outro.');
      } else {
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para salvar o agendamento. Verifique as regras do Firestore.'
            : 'Não foi possível salvar o agendamento. Verifique sua conexão e tente novamente.',
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ImageBackground
      source={require('../DESIGN/seleção_barbeiro.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>ESCOLHA A DATA E O HORÁRIO</Text>
            <Text style={styles.text}>
              Data selecionada: {formatarData(dataSelecionada)}
            </Text>
            {mensagemErro ? <Text style={styles.avisoAgenda}>{mensagemErro}</Text> : null}
            {dadosCarregados && agendaSuspensa ? (
              <Text style={styles.avisoAgenda}>
                Agenda suspensa nesta data. Não é possível realizar agendamentos.
              </Text>
            ) : null}
            {!dadosCarregados ? (
              <Text style={styles.text}>Verificando disponibilidade...</Text>
            ) : null}

            <View style={styles.calendario}>
              <View style={styles.navegacaoCalendario}>
                <TouchableOpacity
                  style={styles.botaoMes}
                  onPress={() => alterarMes(-1)}
                  disabled={!mesAnteriorDisponivel}
                  accessibilityRole="button"
                  accessibilityLabel="Mês anterior"
                >
                  <Text style={[
                    styles.textoBotaoMes,
                    !mesAnteriorDisponivel && styles.textoDesabilitado,
                  ]}
                  >
                    {'<'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.tituloMes}>
                  {nomesMeses[mesExibido.getMonth()]} {mesExibido.getFullYear()}
                </Text>
                <TouchableOpacity
                  style={styles.botaoMes}
                  onPress={() => alterarMes(1)}
                  accessibilityRole="button"
                  accessibilityLabel="Próximo mês"
                >
                  <Text style={styles.textoBotaoMes}>{'>'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gradeCalendario}>
                {diasDaSemana.map((dia, index) => (
                  <View key={`semana-${index}`} style={styles.celulaCalendario}>
                    <Text style={styles.diaDaSemana}>{dia}</Text>
                  </View>
                ))}
                {diasDoMes.map((dia, index) => {
                  if (dia === null) {
                    return (
                      <View
                        key={`vazio-${index}`}
                        style={styles.celulaCalendario}
                      />
                    );
                  }

                  const data = criarDataLocal(
                    mesExibido.getFullYear(),
                    mesExibido.getMonth(),
                    dia,
                  );
                  const selecionado = (
                    data.getTime() === dataSelecionada.getTime()
                  );
                  const desabilitado = data < hoje;

                  return (
                    <TouchableOpacity
                      key={`dia-${dia}`}
                      style={[
                        styles.celulaCalendario,
                        styles.botaoDia,
                        selecionado && styles.diaSelecionado,
                        desabilitado && styles.diaDesabilitado,
                      ]}
                      onPress={() => selecionarDia(dia)}
                      disabled={desabilitado}
                      accessibilityRole="button"
                      accessibilityLabel={formatarData(data)}
                      accessibilityState={{
                        selected: selecionado,
                        disabled: desabilitado,
                      }}
                    >
                      <Text style={[
                        styles.textoDia,
                        selecionado && styles.textoDiaSelecionado,
                        desabilitado && styles.textoDesabilitado,
                      ]}
                      >
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text style={styles.subtitulo}>HORÁRIOS DISPONÍVEIS</Text>
            <View style={styles.listaHorarios}>
              {horarios.map((horario) => {
                const selecionado = horarioSelecionado === horario;
                const ocupado = agendamentos.some((agendamento) => (
                  agendamento.idBarbeiro === barbeiroId
                  && agendamento.horario === horario
                ));
                const indisponivel = (
                  !dadosCarregados
                  || Boolean(mensagemErro)
                  || agendaSuspensa
                  || ocupado
                );

                return (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.botaoHorario,
                      selecionado && styles.horarioSelecionado,
                      indisponivel && styles.botaoDesabilitado,
                    ]}
                    onPress={() => setHorarioSelecionado(horario)}
                    disabled={indisponivel}
                    accessibilityRole="button"
                    accessibilityLabel={ocupado
                      ? `Horário ${horario} ocupado`
                      : `Selecionar horário ${horario}`}
                    accessibilityState={{
                      selected: selecionado,
                      disabled: indisponivel,
                    }}
                  >
                    <Text style={[
                      styles.textoHorario,
                      selecionado && styles.textoHorarioSelecionado,
                      ocupado && styles.textoDesabilitado,
                    ]}
                    >
                      {ocupado ? `${horario} - OCUPADO` : horario}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {fluxoAdministrador && dataSelecionada && horarioSelecionado ? (
              <View style={styles.campoCliente}>
                <Text style={styles.subtitulo}>NOME DO CLIENTE</Text>
                <TextInput
                  style={styles.inputCliente}
                  value={nomeCliente}
                  onChangeText={setNomeCliente}
                  placeholder="Digite o nome do cliente"
                  autoCapitalize="words"
                  autoCorrect={false}
                  accessibilityLabel="Nome do cliente"
                />
              </View>
            ) : null}

            {dataSelecionada && horarioSelecionado ? (
              <TouchableOpacity
                style={[
                  styles.botaoHorario,
                  styles.horarioSelecionado,
                  (salvando
                    || !dadosCarregados
                    || Boolean(mensagemErro)
                    || agendaSuspensa
                    || horarioOcupado
                    || (fluxoAdministrador && !nomeCliente.trim()))
                    && styles.botaoDesabilitado,
                  {
                    marginTop: 20,
                    width: '60%',
                  },
                ]}
                disabled={
                  salvando
                  || !dadosCarregados
                  || Boolean(mensagemErro)
                  || agendaSuspensa
                  || horarioOcupado
                  || (fluxoAdministrador && !nomeCliente.trim())
                }
                onPress={confirmarAgendamento}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: (
                    salvando
                    || !dadosCarregados
                    || Boolean(mensagemErro)
                    || agendaSuspensa
                    || horarioOcupado
                    || (fluxoAdministrador && !nomeCliente.trim())
                  ),
                }}
                accessibilityLabel="Confirmar agendamento e voltar para a área inicial"
              >
                <Text style={styles.textoHorarioSelecionado}>
                  {salvando ? 'SALVANDO...' : 'CONFIRMAR AGENDAMENTO'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
