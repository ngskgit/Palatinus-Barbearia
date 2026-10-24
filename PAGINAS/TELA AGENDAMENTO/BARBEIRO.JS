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

export default function Tarefas() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiroSelecionadoId, setBarbeiroSelecionadoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'barbeiros'),
      (snapshot) => {
        const barbeirosCadastrados = snapshot.docs
          .map((barbeiroDoc) => ({
            id: barbeiroDoc.id,
            ...barbeiroDoc.data(),
          }))
          .filter((barbeiro) => (
            typeof barbeiro.nome === 'string' && barbeiro.nome.trim().length > 0
          ));
        setBarbeiros(barbeirosCadastrados);
        setBarbeiroSelecionadoId((idSelecionado) => (
          barbeirosCadastrados.some((barbeiro) => barbeiro.id === idSelecionado)
            ? idSelecionado
            : null
        ));
        setMensagemErro('');
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar barbeiros para agendamento:', error);
        setMensagemErro(
          error.code === 'permission-denied'
            ? 'Sem permissão para consultar os barbeiros.'
            : 'Não foi possível carregar os barbeiros. Verifique sua conexão e tente novamente.',
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
          <Text style={styles.title}>SELECIONE UM BARBEIRO</Text>
          {carregando ? (
            <Text style={styles.text}>Carregando barbeiros...</Text>
          ) : mensagemErro ? (
            <Text style={styles.text}>{mensagemErro}</Text>
          ) : barbeiros.length === 0 ? (
            <Text style={styles.text}>Nenhum barbeiro cadastrado.</Text>
          ) : (
            <ScrollView
              style={styles.lista}
              contentContainerStyle={styles.listaConteudo}
              showsVerticalScrollIndicator={false}
            >
              {barbeiros.map((barbeiro) => {
                const selecionado = barbeiroSelecionadoId === barbeiro.id;

                return (
                  <TouchableOpacity
                    key={barbeiro.id}
                    style={[
                      styles.button,
                      styles.botaoBarbeiro,
                      selecionado && styles.barbeiroSelecionado,
                    ]}
                    onPress={() => setBarbeiroSelecionadoId(barbeiro.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar barbeiro ${barbeiro.nome}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <Text style={styles.buttonText}>
                      {selecionado ? `${barbeiro.nome} - SELECIONADO` : barbeiro.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}