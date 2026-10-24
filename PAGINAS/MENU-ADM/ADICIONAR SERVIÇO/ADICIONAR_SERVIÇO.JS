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

export default function AdicionarServico() {
  const usuario = auth.currentUser;
  const administradorAutenticado =
    usuario?.email?.trim().toLowerCase() === EMAIL_ADMIN;
  const [servicos, setServicos] = useState([]);
  const [nomeServico, setNomeServico] = useState('');
  const [formularioVisivel, setFormularioVisivel] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!administradorAutenticado) {
      setServicos([]);
      setMensagem(
        usuario
          ? 'Entre com a conta administradora para gerenciar serviços.'
          : 'Faça login com a conta administradora antes de gerenciar serviços.',
      );
      setCarregando(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(database, 'servicos'),
      (snapshot) => {
        setServicos(snapshot.docs.map((servicoDoc) => ({
          id: servicoDoc.id,
          ...servicoDoc.data(),
        })).filter((servico) => (
          typeof servico.nome === 'string' && servico.nome.trim().length > 0
        )));
        setMensagem('');
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
        setMensagem(
          error.code === 'permission-denied'
            ? 'O Firestore bloqueou a leitura. Ajuste as regras da coleção "servicos" para permitir acesso à conta administradora.'
            : 'Não foi possível carregar os serviços. Verifique sua conexão e tente novamente.',
        );
        setCarregando(false);
      },
    );

    return unsubscribe;
  }, [administradorAutenticado, usuario]);

  async function concluirCadastro() {
    if (!administradorAutenticado || !usuario) {
      setMensagem('Faça login com a conta administradora antes de cadastrar serviços.');
      return;
    }

    const nome = nomeServico.trim();
    if (!nome) {
      setMensagem('Digite o nome do serviço.');
      return;
    }

    setSalvando(true);
    setMensagem('');

    try {
      await addDoc(collection(database, 'servicos'), {
        nome,
        idUser: usuario.uid,
        criadoEm: serverTimestamp(),
      });
      setNomeServico('');
      setFormularioVisivel(false);
      setMensagem('Serviço adicionado com sucesso.');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      setMensagem(
        error.code === 'permission-denied'
          ? 'O Firestore bloqueou o cadastro. Ajuste as regras da coleção "servicos" para permitir gravação à conta administradora.'
          : 'Não foi possível adicionar o serviço. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirServico() {
    if (!servicoParaExcluir) {
      return;
    }

    if (!administradorAutenticado) {
      setMensagem('Faça login com a conta administradora antes de excluir serviços.');
      return;
    }

    setExcluindo(true);
    setMensagem('');

    try {
      await deleteDoc(doc(database, 'servicos', servicoParaExcluir.id));
      setMensagem(`Serviço "${servicoParaExcluir.nome}" excluído.`);
      setServicoParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      setMensagem(
        error.code === 'permission-denied'
          ? 'O Firestore bloqueou a exclusão. Ajuste as regras da coleção "servicos" para permitir exclusão à conta administradora.'
          : 'Não foi possível excluir o serviço. Verifique sua conexão e tente novamente.',
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
          <Text style={styles.title}>ADICIONE UM SERVIÇO</Text>

          {carregando ? (
            <Text style={styles.text}>Carregando serviços...</Text>
          ) : (
            <ScrollView
              style={styles.lista}
              contentContainerStyle={styles.listaConteudo}
              keyboardShouldPersistTaps="handled"
            >
              {servicos.map((servico) => (
                <View key={servico.id} style={styles.itemServico}>
                  <View style={[styles.button, styles.cartaoServico]}>
                    <Text style={styles.buttonText}>{servico.nome}</Text>
                  </View>
                  {servicoParaExcluir?.id === servico.id ? (
                    <View style={styles.confirmacaoExclusao}>
                      <Text style={styles.textoConfirmacao}>
                        Excluir {servico.nome}?
                      </Text>
                      <View style={styles.acoesExclusao}>
                        <TouchableOpacity
                          style={[styles.botaoAcaoExclusao, styles.botaoCancelar]}
                          onPress={() => setServicoParaExcluir(null)}
                          disabled={excluindo}
                          accessibilityRole="button"
                        >
                          <Text style={styles.textoAcaoExclusao}>CANCELAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.botaoAcaoExclusao, styles.botaoConfirmarExclusao]}
                          onPress={excluirServico}
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
                        setServicoParaExcluir(servico);
                      }}
                      disabled={excluindo}
                      accessibilityRole="button"
                      accessibilityLabel={`Excluir serviço ${servico.nome}`}
                    >
                      <Text style={styles.textoBotaoExcluir}>EXCLUIR</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {servicos.length === 0 && administradorAutenticado ? (
                <Text style={styles.text}>Nenhum serviço cadastrado.</Text>
              ) : null}
            </ScrollView>
          )}

          {administradorAutenticado && (formularioVisivel ? (
            <View style={styles.formulario}>
              <TextInput
                style={styles.input}
                value={nomeServico}
                onChangeText={setNomeServico}
                placeholder="Nome do serviço"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!salvando}
                accessibilityLabel="Nome do serviço"
              />
              <View style={styles.acoesFormulario}>
                <TouchableOpacity
                  style={[styles.botaoAcaoFormulario, styles.botaoCancelar]}
                  onPress={() => {
                    setNomeServico('');
                    setFormularioVisivel(false);
                    setMensagem('');
                  }}
                  disabled={salvando}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoAcaoExclusao}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.botaoAcaoFormulario,
                    styles.botaoConcluir,
                    salvando && styles.botaoDesabilitado,
                  ]}
                  onPress={concluirCadastro}
                  disabled={salvando}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoAcaoExclusao}>
                    {salvando ? 'SALVANDO...' : 'CONCLUIR'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.botaoADICIONAR]}
              onPress={() => {
                setMensagem('');
                setFormularioVisivel(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Adicionar serviço"
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          ))}

          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
