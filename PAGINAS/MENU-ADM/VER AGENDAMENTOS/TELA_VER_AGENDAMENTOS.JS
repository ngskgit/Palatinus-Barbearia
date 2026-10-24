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
          <TouchableOpacity
            style={[styles.button, styles.botaoVER_AGENDAMENTO]}
           
          >
            <Text style={styles.buttonText}>VER AGENDAMENTO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.botaoADICIONAR_SERVICO]}
           
          >
            <Text style={styles.buttonText}>ADICIONAR SERVIÇO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.botaoADICIONAR_BARBEIRO]}

          >
            <Text style={styles.buttonText}>ADICIONAR BARBEIRO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}