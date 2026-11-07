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
import { collection, onSnapshot } from 'firebase/firestore';

import { database } from '../../firebaseConfig';
import styles from './style';

export default function SelecionarServico({ navigation, route }) {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'servicos'),
      (snapshot) => {
        const servicosCadastrados = snapshot.docs
          .map((servicoDoc) => ({
            id: servicoDoc.id,
            ...servicoDoc.data(),
          }))
          .filter((servico) => (
            typeof servico.nome === 'string' && servico.nome.trim().length > 0
          ));
        setServicos(servicosCadastrados);
        setServicoSelecionadoId((idSelecionado) => (
          servicosCadastrados.some((servico) => servico.id === idSelecionado)
            ? idSelecionado
            : null
        ));
        setMensagemErro('');
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar serviços para agendamento:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar os serviços.'
            : 'Não foi possível carregar os serviços. Verifique sua conexão e tente novamente.',
        );
        setCarregando(false);
      },
    );

    return unsubscribe;
  }, []);

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
        <View style={styles.content}>
          <Text style={styles.title}>SELECIONE UM SERVIÇO</Text>
          {carregando ? (
            <Text style={styles.text}>Carregando serviços...</Text>
          ) : mensagemErro ? (
            <Text style={styles.text}>{mensagemErro}</Text>
          ) : servicos.length === 0 ? (
            <Text style={styles.text}>Nenhum serviço cadastrado.</Text>
          ) : (
            <ScrollView
              style={styles.lista}
              contentContainerStyle={styles.listaConteudo}
              showsVerticalScrollIndicator={false}
            >
              {servicos.map((servico) => {
                const selecionado = servicoSelecionadoId === servico.id;

                return (
                  <TouchableOpacity
                    key={servico.id}
                    style={[
                      styles.button,
                      styles.botaoServiço,
                      selecionado && styles.serviçoSelecionado,
                    ]}
                    onPress={() => setServicoSelecionadoId(servico.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar serviço ${servico.nome}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <Text style={styles.buttonText}>
                      {selecionado ? `${servico.nome} - SELECIONADO` : servico.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          {!carregando && !mensagemErro && servicoSelecionadoId ? (
            <TouchableOpacity
              style={[styles.button, styles.botao]}
              onPress={() => navigation.navigate('BARBEIROS', {
                idUser: route?.params?.idUser,
                servicoSelecionadoId,
                servicoNome: servicos.find(
                  (servico) => servico.id === servicoSelecionadoId,
                )?.nome,
                returnRoute: route?.params?.returnRoute,
              })}
              accessibilityRole="button"
              accessibilityLabel="Continuar para selecionar um barbeiro"
            >
              <Text style={styles.buttonText}>CONTINUAR</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}