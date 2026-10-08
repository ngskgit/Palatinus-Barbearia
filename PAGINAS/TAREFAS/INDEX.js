import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';

import styles from './style';

export default function Tarefas({ route }) {
  const idUser = route?.params?.idUser;

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
        <View style={styles.content}>
          <Text style={styles.title}>AGENDAMENTO</Text>
          <View style={[styles.button, styles.botaoAGENDAMENTO]}>
            <Text style={styles.buttonText}>AGENDAR HORÁRIO</Text>
          </View>
          <View style={[styles.button, styles.botaoCANCELAMENTO]}>
            <Text style={styles.buttonText}>CANCELAR AGENDAMENTO</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
