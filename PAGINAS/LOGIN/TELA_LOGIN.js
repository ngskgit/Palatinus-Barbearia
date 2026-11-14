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

import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, database } from '../../firebaseConfig';
import styles from './style';

const EMAIL_ADMIN = 'adm123@gmail.com';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [usuarioSemNome, setUsuarioSemNome] = useState(null);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const loginFirebase = async () => {
    setErrorLogin('');
    setUsuarioSemNome(null);

    if (!email || !senha) {
      setErrorLogin('Preencha o e-mail e a senha.');
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), senha);
      console.log('Login realizado:', user.uid);

      if (user.email?.trim().toLowerCase() === EMAIL_ADMIN) {
        navigation.replace('TelaInicialAdm', { idUser: user.uid });
        return;
      }

      const perfil = await getDoc(doc(database, 'usuarios', user.uid));
      const nomeCliente = (
        perfil.data()?.nomeCompleto?.trim()
        || perfil.data()?.displayName?.trim()
        || user.displayName?.trim()
      );

      if (!nomeCliente) {
        setUsuarioSemNome(user);
        setErrorLogin('Informe seu nome completo para concluir o perfil.');
        return;
      }

      if (user.displayName !== nomeCliente) {
        await updateProfile(user, { displayName: nomeCliente });
      }

      navigation.navigate('Tarefas', {
        idUser: user.uid,
        nomeCliente,
      });
    } catch (error) {
      console.error('Erro no login ou ao carregar o perfil:', error);
      const mensagensErro = {
        'auth/invalid-credential': 'E-mail ou senha incorretos. Confira os dados e tente novamente.',
        'auth/wrong-password': 'Senha incorreta. Confira a senha ou redefina-a no Firebase Authentication.',
        'auth/user-not-found': 'Esta conta não foi encontrada no Firebase Authentication.',
        'auth/invalid-email': 'O formato do e-mail é inválido.',
        'auth/too-many-requests': 'Muitas tentativas de login. Aguarde um pouco e tente novamente.',
        'auth/network-request-failed': 'Não foi possível conectar ao Firebase. Verifique sua internet e tente novamente.',
        'permission-denied': 'Login realizado, mas sem permissão para carregar seu perfil. Verifique as regras de leitura da coleção usuarios.',
      };
      setErrorLogin(
        mensagensErro[error.code]
        || 'Não foi possível entrar ou carregar seu perfil. Verifique os dados e as regras do Firebase.',
      );
    }
  };

  const salvarNomeCliente = async () => {
    const nomeCompleto = nomeCliente.trim();
    if (!usuarioSemNome || !nomeCompleto) {
      setErrorLogin('Digite seu nome completo.');
      return;
    }

    setSalvandoPerfil(true);
    setErrorLogin('');
    try {
      await setDoc(doc(database, 'usuarios', usuarioSemNome.uid), {
        idUser: usuarioSemNome.uid,
        nomeCompleto,
        displayName: nomeCompleto,
        email: usuarioSemNome.email,
      }, { merge: true });
      await updateProfile(usuarioSemNome, { displayName: nomeCompleto });

      navigation.navigate('Tarefas', {
        idUser: usuarioSemNome.uid,
        nomeCliente: nomeCompleto,
      });
    } catch (error) {
      console.error('Erro ao salvar o nome do perfil:', error);
      setErrorLogin(
        error.code === 'permission-denied'
          ? 'O Firestore bloqueou a atualização do perfil. Verifique as regras de criação e leitura da coleção usuarios.'
          : 'Não foi possível salvar seu nome. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setSalvandoPerfil(false);
    }
  };

  return (
    <ImageBackground
      source={require('../DESIGN/tela_login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
          />

          {errorLogin !== '' && <Text style={styles.error}>{errorLogin}</Text>}

          {usuarioSemNome ? (
            <>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                value={nomeCliente}
                onChangeText={setNomeCliente}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!salvandoPerfil}
                accessibilityLabel="Nome completo do cliente"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={salvarNomeCliente}
                disabled={salvandoPerfil || !nomeCliente.trim()}
              >
                <Text style={styles.buttonText}>
                  {salvandoPerfil ? 'SALVANDO...' : 'SALVAR NOME E CONTINUAR'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={loginFirebase}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('NOVOUSUARIO')}>
            <Text style={styles.linkText}>PRIMEIRO ACESSO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}