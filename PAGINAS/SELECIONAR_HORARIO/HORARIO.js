import React, { useState } from 'react';
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
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
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
  const [mensagemErro, setMensagemErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const chaveData = criarChaveData(dataSelecionada);
  const barbeiroId = route?.params?.barbeiroSelecionadoId;

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
    setMensagemErro('');
  }

  async function confirmarAgendamento() {
    const nomeClienteNormalizado = fluxoAdministrador
      ? nomeCliente.trim()
      : route?.params?.nomeCliente?.trim()
        || auth.currentUser?.displayName?.trim();

    if (!horarioSelecionado || !barbeiroId || !route?.params?.servicoSelecionadoId) {
      setMensagemErro('Selecione um serviço, barbeiro e horário antes de continuar.');
      return;
    }
    if (fluxoAdministrador && !nomeClienteNormalizado) {
      setMensagemErro('Digite o nome do cliente.');
      return;
    }
    if (!nomeClienteNormalizado) {
      setMensagemErro('Não encontramos seu nome. Saia e entre novamente antes de agendar.');
      return;
    }
    if (!auth.currentUser) {
      setMensagemErro('Faça login antes de confirmar o agendamento.');
      return;
    }
    setSalvando(true);
    setMensagemErro('');
    const horarioChave = horarioSelecionado.replace(':', '-');
    const idAgendamento = `${chaveData}_${barbeiroId}_${horarioChave}`;
    const referenciaAgendamento = doc(database, 'agendamentos', idAgendamento);

    try {
      await setDoc(referenciaAgendamento, {
        data: chaveData,
        horario: horarioChave,
        nomeCliente: nomeClienteNormalizado,
        idUsuario: auth.currentUser.uid,
        idBarbeiro: barbeiroId,
        nomeBarbeiro: route?.params?.barbeiroNome || '',
        idServico: route.params.servicoSelecionadoId,
        nomeServico: route?.params?.servicoNome || '',
        criadoEm: serverTimestamp(),
      });

      navigation.navigate(telaRetorno, {
        idUser: route?.params?.idUser,
      });
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setMensagemErro(
        error.code === 'permission-denied'
          ? 'Não foi possível reservar. Este horário pode já estar ocupado.'
          : 'Não foi possível salvar o agendamento. Verifique sua conexão e tente novamente.',
      );
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

            <Text style={styles.subtitulo}>ESCOLHA UM HORÁRIO</Text>
            <Text style={styles.text}>
              A disponibilidade será confirmada ao reservar.
            </Text>
            <View style={styles.listaHorarios}>
              {horarios.map((horario) => {
                const selecionado = horarioSelecionado === horario;

                return (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.botaoHorario,
                      selecionado && styles.horarioSelecionado,
                    ]}
                    onPress={() => {
                      setHorarioSelecionado(horario);
                      setMensagemErro('');
                    }}
                    disabled={salvando}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar horário ${horario}`}
                    accessibilityState={{
                      selected: selecionado,
                      disabled: salvando,
                    }}
                  >
                    <Text style={[
                      styles.textoHorario,
                      selecionado && styles.textoHorarioSelecionado,
                    ]}
                    >
                      {horario}
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
                  (salvando || (fluxoAdministrador && !nomeCliente.trim()))
                    && styles.botaoDesabilitado,
                  {
                    marginTop: 20,
                    width: '60%',
                  },
                ]}
                disabled={
                  salvando || (fluxoAdministrador && !nomeCliente.trim())
                }
                onPress={confirmarAgendamento}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: (
                    salvando || (fluxoAdministrador && !nomeCliente.trim())
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
