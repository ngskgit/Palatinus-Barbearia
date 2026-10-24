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
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, database } from '../../../firebaseConfig';
import styles from './style';

const EMAIL_ADMIN = 'adm123@gmail.com';

export default function Tarefas() {
  const usuario = auth.currentUser;
  const administradorAutenticado =
    usuario?.email?.trim().toLowerCase() === EMAIL_ADMIN;
  const [barbeiros, setBarbeiros] = useState([]);
  const [nomeBarbeiro, setNomeBarbeiro] = useState('');
  const [formularioVisivel, setFormularioVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [barbeiroParaExcluir, setBarbeiroParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!administradorAutenticado) {
      setBarbeiros([]);
      setMensagem(
        usuario
          ? 'Entre com a conta administradora para gerenciar barbeiros.'
          : 'Faça login com a conta administradora antes de gerenciar barbeiros.',
      );
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(database, 'barbeiros'),
      (snapshot) => {
        setBarbeiros(snapshot.docs.map((barbeiroDoc) => ({
          id: barbeiroDoc.id,
          ...barbeiroDoc.data(),
        })));
      },
      (error) => {
        console.error('Erro ao carregar barbeiros:', error);
        setMensagem(
          error.code === 'permission-denied'
            ? 'O Firestore bloqueou a leitura. Ajuste as regras da coleção "barbeiros" para permitir acesso à conta administradora.'
            : 'Não foi possível carregar os barbeiros. Verifique sua conexão e tente novamente.',
        );
      },
    );

    return unsubscribe;
  }, [administradorAutenticado, usuario]);

  async function concluirCadastro() {
    if (!administradorAutenticado || !usuario) {
      setMensagem('Faça login com a conta administradora antes de cadastrar barbeiros.');
      return;
    }

    const nome = nomeBarbeiro.trim();
    if (!nome) {
      setMensagem('Digite o nome do barbeiro.');
      return;
    }

    setSalvando(true);
    setMensagem('');

    try {
      await addDoc(collection(database, 'barbeiros'), {
        nome,
        idUser: usuario.uid,
        criadoEm: serverTimestamp(),
      });
      setNomeBarbeiro('');
      setFormularioVisivel(false);
      setMensagem('Barbeiro adicionado com sucesso.');
    } catch (error) {
      console.error('Erro ao adicionar barbeiro:', error);
      setMensagem(
        error.code === 'permission-denied'
          ? 'O Firestore bloqueou o cadastro. Ajuste as regras da coleção "barbeiros" para permitir gravação à conta administradora.'
          : 'Não foi possível adicionar o barbeiro. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirBarbeiro() {
    if (!barbeiroParaExcluir) {
      return;
    }

    if (!administradorAutenticado) {
      setMensagem('Faça login com a conta administradora antes de excluir barbeiros.');
      return;
    }

    setExcluindo(true);
    setMensagem('');

    try {
      await deleteDoc(doc(database, 'barbeiros', barbeiroParaExcluir.id));
      setMensagem(`Barbeiro "${barbeiroParaExcluir.nome}" excluído.`);
      setBarbeiroParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir barbeiro:', error);
      setMensagem(
        error.code === 'permission-denied'
          ? 'O Firestore bloqueou a exclusão. Ajuste as regras da coleção "barbeiros" para permitir exclusão à conta administradora.'
          : 'Não foi possível excluir o barbeiro. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <ImageBackground
      source={require('../../DESIGN/seleção_barbeiro.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>ADICIONE UM BARBEIRO</Text>
          <ScrollView
            style={styles.lista}
            contentContainerStyle={styles.listaConteudo}
            keyboardShouldPersistTaps="handled"
          >
            {barbeiros.map((barbeiro) => (
              <View key={barbeiro.id} style={styles.itemBarbeiro}>
                <View style={[styles.button, styles.botaoBarbeiro]}>
                  <Text style={styles.buttonText}>{barbeiro.nome}</Text>
                </View>
                {barbeiroParaExcluir?.id === barbeiro.id ? (
                  <View style={styles.confirmacaoExclusao}>
                    <Text style={styles.textoConfirmacao}>
                      Excluir {barbeiro.nome}?
                    </Text>
                    <View style={styles.acoesExclusao}>
                      <TouchableOpacity
                        style={[styles.botaoAcaoExclusao, styles.botaoCancelar]}
                        onPress={() => setBarbeiroParaExcluir(null)}
                        disabled={excluindo}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoAcaoExclusao}>CANCELAR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoAcaoExclusao, styles.botaoConfirmarExclusao]}
                        onPress={excluirBarbeiro}
                        disabled={excluindo}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoAcaoExclusao}>
                          {excluindo ? 'EXCLUINDO...' : 'CONFIRMAR'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.botaoExcluir}
                    onPress={() => {
                      setMensagem('');
                      setBarbeiroParaExcluir(barbeiro);
                    }}
                    disabled={excluindo}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir barbeiro ${barbeiro.nome}`}
                  >
                    <Text style={styles.textoBotaoExcluir}>EXCLUIR</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {formularioVisivel ? (
            <View style={styles.formulario}>
              <TextInput
                style={styles.input}
                value={nomeBarbeiro}
                onChangeText={setNomeBarbeiro}
                placeholder="Nome do barbeiro"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!salvando}
                accessibilityLabel="Nome do barbeiro"
              />
              <TouchableOpacity
                style={[styles.button, styles.botaoConcluir, salvando && styles.botaoDesabilitado]}
                onPress={concluirCadastro}
                disabled={salvando}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>
                  {salvando ? 'SALVANDO...' : 'CONCLUIR'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.botaoADICIONAR]}
              onPress={() => {
                setMensagem('');
                setFormularioVisivel(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Adicionar barbeiro"
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          )}

          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
