import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
} from 'react-native';
import { auth, database } from '../../firebaseConfig';
import styles from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function NOVOUSUARIO({ navigation }) {
  const [CPF, setCPF] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorCadastro, setErrorCadastro] = useState('');
  const [cadastrando, setCadastrando] = useState(false);

  const cadastrarFirebase = async () => {
    setErrorCadastro('');
    const cpfNormalizado = CPF.replace(/\D/g, '');
    const nomeCompleto = nome.trim();

    if (!nomeCompleto || cpfNormalizado.length !== 11 || !email.trim() || !senha) {
      setErrorCadastro('Preencha todos os campos e informe um CPF com 11 números.');
      return;
    }

    setCadastrando(true);

    try {
      const emailNormalizado = email.trim();
      let user = auth.currentUser;

      if (user?.email?.toLowerCase() !== emailNormalizado.toLowerCase()) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailNormalizado,
          senha,
        );
        user = userCredential.user;
      }

      await setDoc(doc(database, 'usuarios', user.uid), {
        idUser: user.uid,
        nomeCompleto,
        cpf: cpfNormalizado,
        email: user.email,
        criadoEm: serverTimestamp(),
      });

      navigation.navigate('Tarefas', { idUser: user.uid });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      const contaEstaAutenticada =
        auth.currentUser?.email?.toLowerCase() === email.trim().toLowerCase();

      if (contaEstaAutenticada) {
        setErrorCadastro(
          error.code === 'permission-denied'
            ? 'Conta criada, mas o Firestore negou o salvamento. Verifique as regras de acesso.'
            : 'Conta criada, mas não foi possível salvar o perfil. Tente novamente.',
        );
      } else {
        setErrorCadastro('Não foi possível concluir o cadastro. Confira os dados e tente novamente.');
      }
    } finally {
      setCadastrando(false);
    }
  };

  return (
    //imagem de fundo
    <ImageBackground
      source={require('../DESIGN/tela_login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.conteudo}
      >
        <Text style={styles.textoTitulo}>CADASTRE-SE</Text>
         <TextInput
          style={styles.input}
          placeholder="CPF:"
          keyboardType="numeric"
          autoCapitalize="none"
          onChangeText={setCPF}
          value={CPF}
          maxLength={14}
        />
        <TextInput
          style={styles.input}
          placeholder="NOME COMPLETO:"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setNome}
          value={nome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail:"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha:"
          secureTextEntry
          onChangeText={setSenha}
          value={senha}
        />

        {errorCadastro ? (
          <View style={styles.conteudoAlerta}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="red" />
            <Text style={styles.textoAlerta}>{errorCadastro}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          disabled={
            cadastrando ||
            !nome.trim() ||
            CPF.replace(/\D/g, '').length !== 11 ||
            !email.trim() ||
            !senha
          }
          style={[
            styles.botaoCadastro,
            (cadastrando ||
              !nome.trim() ||
              CPF.replace(/\D/g, '').length !== 11 ||
              !email.trim() ||
              !senha) && { opacity: 0.5 },
          ]}
          onPress={cadastrarFirebase}
        >
          <Text style={styles.textoBotaoCadastro}>
            {cadastrando ? 'CADASTRANDO...' : 'CADASTRAR'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.registrar}>
          JÁ POSSUI UMA CONTA?{' '}
          <Text
            style={styles.linkcadastrar}
            onPress={() => navigation.navigate('Login')}
          >
            FAÇA LOGIN
          </Text>
        </Text>

        <View style={{ height: 50 }} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
