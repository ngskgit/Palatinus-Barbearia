import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './style';

export default function Tarefas({ navigation, route }) {
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
          <TouchableOpacity
            style={[styles.button, styles.botaoAGENDAMENTO]}
            onPress={() => navigation.navigate('SERVICOS', { idUser })}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>AGENDAR HORÁRIO</Text>
          </TouchableOpacity>
          <View style={[styles.button, styles.botaoCANCELAMENTO]}>
            <Text style={styles.buttonText}>CANCELAR AGENDAMENTO</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
