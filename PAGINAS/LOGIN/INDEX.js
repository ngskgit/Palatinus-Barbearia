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

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import styles from './style';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  const loginFirebase = () => {
    setErrorLogin('');

    if (!email || !senha) {
      setErrorLogin('Preencha o e-mail e a senha.');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Login realizado:', user.uid);

        navigation.navigate('Tarefas', {
          idUser: user.uid,
        });
      })
      .catch((error) => {
        console.log('Erro no login:', error);
        setErrorLogin('Informações inválidas.');
      });
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

          <TouchableOpacity style={styles.button} onPress={loginFirebase}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('NOVOUSUARIO')}>
            <Text style={styles.linkText}>PRIMEIRO ACESSO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}