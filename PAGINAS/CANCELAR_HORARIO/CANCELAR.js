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
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { auth, database } from '../../firebaseConfig';
import styles from './style';

function formatarData(data) {
  const [ano, mes, dia] = String(data || '').split('-');
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : 'Data não informada';
}

function formatarHorario(horario) {
  return String(horario || 'Horário não informado').replace('-', ':');
}

export default function CancelarAgendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const usuarioId = auth.currentUser?.uid;

  useEffect(() => {
    if (!usuarioId) {
      setMensagemErro('Entre na sua conta para consultar seus agendamentos.');
      setCarregando(false);
      return undefined;
    }

    const consultaAgendamentos = query(
      collection(database, 'agendamentos'),
      where('idUsuario', '==', usuarioId),
    );

    return onSnapshot(
      consultaAgendamentos,
      (snapshot) => {
        setAgendamentos(snapshot.docs
          .map((agendamentoDoc) => ({
            id: agendamentoDoc.id,
            ...agendamentoDoc.data(),
          }))
          .sort((a, b) => (
            `${a.data}_${a.horario}`.localeCompare(`${b.data}_${b.horario}`)
          )));
        setMensagemErro('');
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar agendamentos do cliente:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar seus agendamentos. Verifique as regras de leitura do Firestore.'
            : 'Não foi possível carregar seus agendamentos. Verifique sua conexão e tente novamente.',
        );
        setCarregando(false);
      },
    );
  }, [usuarioId]);

  async function excluirAgendamento(agendamento) {
    setExcluindoId(agendamento.id);
    setMensagemErro('');
    try {
      await deleteDoc(doc(database, 'agendamentos', agendamento.id));
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setMensagemErro(
        error.code === 'permission-denied'
          ? 'Sem permissão para cancelar este agendamento. Verifique as regras de exclusão do Firestore.'
          : 'Não foi possível cancelar o agendamento. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <ImageBackground
      source={require('../DESIGN/tela_inicial.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.listaConteudo}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.painel}>
            <Text style={styles.titulo}>MEUS AGENDAMENTOS</Text>
            {carregando ? (
              <Text style={styles.mensagem}>Carregando agendamentos...</Text>
            ) : mensagemErro ? (
              <Text style={styles.mensagemErro}>{mensagemErro}</Text>
            ) : agendamentos.length === 0 ? (
              <Text style={styles.mensagem}>Você não tem agendamentos.</Text>
            ) : agendamentos.map((agendamento) => (
              <View key={agendamento.id} style={styles.itemAgendamento}>
                <View style={styles.detalhesAgendamento}>
                  <Text style={styles.horario}>
                    {formatarHorario(agendamento.horario)}
                  </Text>
                  <Text style={styles.detalhe}>
                    Data: {formatarData(agendamento.data)}
                  </Text>
                  <Text style={styles.detalhe}>
                    Serviço: {agendamento.nomeServico || 'Não informado'}
                  </Text>
                  <Text style={styles.detalhe}>
                    Barbeiro: {agendamento.nomeBarbeiro || 'Não informado'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.botaoExcluir,
                    excluindoId === agendamento.id && styles.botaoDesabilitado,
                  ]}
                  onPress={() => excluirAgendamento(agendamento)}
                  disabled={excluindoId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Cancelar agendamento de ${formatarData(agendamento.data)} às ${formatarHorario(agendamento.horario)}`}
                  accessibilityState={{ disabled: excluindoId !== null }}
                >
                  <Text style={styles.textoBotaoExcluir}>
                    {excluindoId === agendamento.id ? 'CANCELANDO...' : 'EXCLUIR'}
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
