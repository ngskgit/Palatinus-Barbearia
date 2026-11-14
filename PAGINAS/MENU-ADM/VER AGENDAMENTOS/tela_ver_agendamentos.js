import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { database } from '../../../firebaseConfig';
import styles from './style';

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const diasDaSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function criarDataLocal(ano, mes, dia) {
  return new Date(ano, mes, dia);
}

function criarChaveData(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function formatarData(data) {
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export default function TelaVerAgendamentos({ route }) {
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return criarDataLocal(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  });
  const [mesExibido, setMesExibido] = useState(() => {
    const hoje = new Date();
    return criarDataLocal(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(true);
  const [agendaSuspensa, setAgendaSuspensa] = useState(false);
  const [carregandoSuspensao, setCarregandoSuspensao] = useState(true);
  const [erroSuspensao, setErroSuspensao] = useState(false);
  const [alterandoSuspensao, setAlterandoSuspensao] = useState(false);
  const [excluindoAgendamentoId, setExcluindoAgendamentoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const chaveData = criarChaveData(dataSelecionada);
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

  useEffect(() => {
    setCarregandoAgendamentos(true);
    setCarregandoSuspensao(true);
    setErroSuspensao(false);
    setMensagemErro('');
    setMensagem('');

    const consultaAgendamentos = query(
      collection(database, 'agendamentos'),
      where('data', '==', chaveData),
    );
    const cancelarAgendamentos = onSnapshot(
      consultaAgendamentos,
      async (snapshot) => {
        try {
          const listaAgendamentos = await Promise.all(snapshot.docs.map(async (agendamentoDoc) => {
            const agendamento = {
              id: agendamentoDoc.id,
              ...agendamentoDoc.data(),
            };
            const cliente = agendamento.idUsuario
              ? await getDoc(doc(database, 'usuarios', agendamento.idUsuario))
              : null;
            const perfil = cliente?.data();
            const nomeSalvo = typeof agendamento.nomeCliente === 'string'
              ? agendamento.nomeCliente.trim()
              : '';
            const nomeSalvoEhEmail = nomeSalvo.includes('@');

            return {
              ...agendamento,
              nomeCliente: nomeSalvoEhEmail
                ? perfil?.nomeCompleto?.trim() || perfil?.displayName?.trim() || nomeSalvo
                : nomeSalvo || perfil?.nomeCompleto?.trim() || perfil?.displayName?.trim(),
            };
          }));
          setAgendamentos(listaAgendamentos
            .sort((a, b) => String(a.horario).localeCompare(String(b.horario))));
        } catch (error) {
          console.error('Erro ao carregar nomes dos clientes:', error);
          setMensagemErro(
            error.code === 'permission-denied'
              ? 'Sem permissão para consultar os perfis dos clientes. Verifique as regras da coleção usuarios.'
              : 'Não foi possível carregar os nomes dos clientes.',
          );
        } finally {
          setCarregandoAgendamentos(false);
        }
      },
      (error) => {
        console.error('Erro ao carregar agendamentos da data:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar os agendamentos.'
            : 'Não foi possível carregar os agendamentos. Verifique sua conexão e tente novamente.',
        );
        setCarregandoAgendamentos(false);
      },
    );
    const cancelarSuspensao = onSnapshot(
      doc(database, 'agendasSuspensas', chaveData),
      (snapshot) => {
        setAgendaSuspensa(snapshot.exists());
        setErroSuspensao(false);
        setCarregandoSuspensao(false);
      },
      (error) => {
        console.error('Erro ao consultar suspensão da agenda:', error);
        setErroSuspensao(true);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar o estado da agenda.'
            : 'Não foi possível consultar o estado da agenda.',
        );
        setCarregandoSuspensao(false);
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
    setDataSelecionada(novaData);
  }

  async function excluirAgendamento(agendamento) {
    setExcluindoAgendamentoId(agendamento.id);
    setMensagem('');
    setMensagemErro('');
    try {
      await deleteDoc(doc(database, 'agendamentos', agendamento.id));
      setMensagem('Agendamento cancelado. O horário está disponível novamente.');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setMensagemErro(
        error.code === 'permission-denied'
          ? 'Sem permissão para cancelar agendamentos. Verifique as regras de exclusão do Firestore.'
          : 'Não foi possível cancelar o agendamento. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setExcluindoAgendamentoId(null);
    }
  }

  async function alternarSuspensao() {
    setAlterandoSuspensao(true);
    setMensagem('');
    setMensagemErro('');
    setErroSuspensao(false);
    try {
      const referenciaAgenda = doc(database, 'agendasSuspensas', chaveData);
      if (agendaSuspensa) {
        await deleteDoc(referenciaAgenda);
        setMensagem('Agenda reaberta para esta data.');
      } else {
        await setDoc(referenciaAgenda, {
          data: chaveData,
          suspensa: true,
          alteradaPor: route?.params?.idUser || null,
          alteradaEm: serverTimestamp(),
        });
        setMensagem('Agenda suspensa para esta data. Novos agendamentos estão bloqueados.');
      }
    } catch (error) {
      console.error('Erro ao alterar suspensão da agenda:', error);
      setErroSuspensao(true);
      setMensagemErro(
        error.code === 'permission-denied'
          ? 'Sem permissão para suspender ou reabrir a agenda.'
          : 'Não foi possível alterar a agenda. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setAlterandoSuspensao(false);
    }
  }

  return (
    <ImageBackground
      source={require('../../DESIGN/tela_inicial.jpg')}
      style={styles.tela}
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
          <View style={styles.painelAgenda}>
            <Text style={styles.tituloAgenda}>AGENDAMENTOS</Text>
            <Text style={styles.textoAgenda}>
              Data selecionada: {formatarData(dataSelecionada)}
            </Text>

            <View style={styles.calendario}>
              <View style={styles.navegacaoCalendario}>
                <TouchableOpacity
                  style={styles.botaoMes}
                  onPress={() => alterarMes(-1)}
                  accessibilityRole="button"
                  accessibilityLabel="Mês anterior"
                >
                  <Text style={styles.textoBotaoMes}>{'<'}</Text>
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
                      <View key={`vazio-${index}`} style={styles.celulaCalendario} />
                    );
                  }
                  const data = criarDataLocal(
                    mesExibido.getFullYear(),
                    mesExibido.getMonth(),
                    dia,
                  );
                  const selecionado = data.getTime() === dataSelecionada.getTime();
                  return (
                    <TouchableOpacity
                      key={`dia-${dia}`}
                      style={[
                        styles.celulaCalendario,
                        styles.botaoDia,
                        selecionado && styles.diaSelecionado,
                      ]}
                      onPress={() => selecionarDia(dia)}
                      accessibilityRole="button"
                      accessibilityLabel={formatarData(data)}
                      accessibilityState={{ selected: selecionado }}
                    >
                      <Text style={[
                        styles.textoDia,
                        selecionado && styles.textoDiaSelecionado,
                      ]}
                      >
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View
              style={[
                styles.estadoAgenda,
                carregandoSuspensao
                  ? styles.estadoAgendaCarregando
                  : erroSuspensao
                    ? styles.estadoAgendaErro
                    : agendaSuspensa
                      ? styles.estadoAgendaSuspensa
                      : styles.estadoAgendaAberta,
              ]}
              accessibilityRole="text"
              accessibilityLabel={carregandoSuspensao
                ? 'Consultando estado da agenda'
                : erroSuspensao
                  ? 'Não foi possível consultar o estado da agenda'
                  : agendaSuspensa
                    ? 'Agenda suspensa'
                    : 'Agenda aberta'}
            >
              <Text style={styles.textoEstadoAgenda}>
                {carregandoSuspensao
                  ? 'CONSULTANDO ESTADO DA AGENDA...'
                  : erroSuspensao
                    ? 'ESTADO DA AGENDA INDISPONÍVEL'
                    : agendaSuspensa
                      ? 'AGENDA SUSPENSA'
                      : 'AGENDA ABERTA'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.botaoSuspensao,
                agendaSuspensa ? styles.botaoReabrir : styles.botaoSuspender,
              ]}
              onPress={alternarSuspensao}
              disabled={
                carregandoSuspensao
                || alterandoSuspensao
                || erroSuspensao
              }
              accessibilityRole="button"
              accessibilityState={{
                disabled: carregandoSuspensao
                  || alterandoSuspensao
                  || erroSuspensao,
              }}
            >
              <Text style={styles.textoBotaoSuspensao}>
                {alterandoSuspensao
                  ? 'ATUALIZANDO...'
                  : agendaSuspensa
                    ? 'REABRIR AGENDA DESTA DATA'
                    : 'SUSPENDER AGENDA DESTA DATA'}
              </Text>
            </TouchableOpacity>

            {agendaSuspensa ? (
              <Text style={styles.avisoSuspensao}>
                Agenda suspensa: novos agendamentos nesta data estão bloqueados.
              </Text>
            ) : null}
            {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
            {mensagemErro ? <Text style={styles.mensagemErro}>{mensagemErro}</Text> : null}

            <Text style={styles.subtituloAgenda}>HORÁRIOS DO DIA</Text>
            {carregandoAgendamentos ? (
              <Text style={styles.textoAgenda}>Carregando agendamentos...</Text>
            ) : mensagemErro ? null : agendamentos.length === 0 ? (
              <Text style={styles.textoAgenda}>Nenhum agendamento nesta data.</Text>
            ) : agendamentos.map((agendamento) => (
              <View key={agendamento.id} style={styles.itemAgendamento}>
                <Text style={styles.horarioAgendamento}>
                  {String(agendamento.horario || 'Horário não informado').replace('-', ':')}
                </Text>
                <Text style={styles.detalheAgendamento}>
                  Cliente: {agendamento.nomeCliente || 'Não informado'}
                </Text>
                <Text style={styles.detalheAgendamento}>
                  Serviço: {agendamento.nomeServico || 'Não informado'}
                </Text>
                <Text style={styles.detalheAgendamento}>
                  Barbeiro: {agendamento.nomeBarbeiro || 'Não informado'}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.botaoExcluirAgendamento,
                    excluindoAgendamentoId === agendamento.id
                      && styles.botaoExcluirAgendamentoDesabilitado,
                  ]}
                  onPress={() => excluirAgendamento(agendamento)}
                  disabled={excluindoAgendamentoId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Cancelar agendamento de ${agendamento.nomeCliente || 'cliente'} às ${String(agendamento.horario || '').replace('-', ':')}`}
                  accessibilityState={{ disabled: excluindoAgendamentoId !== null }}
                >
                  <Text style={styles.textoBotaoExcluirAgendamento}>
                    {excluindoAgendamentoId === agendamento.id
                      ? 'CANCELANDO...'
                      : 'CANCELAR AGENDAMENTO'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
