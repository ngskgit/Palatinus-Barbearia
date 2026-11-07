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
            onPress={() => navigation.navigate('TELA_VER_AGENDAMENTOS', { idUser })}
          >
            <Text style={styles.buttonText}>VER AGENDAMENTO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.botaoAGENDAR]}
            onPress={() => navigation.navigate('SERVICOS', {
              idUser,
              returnRoute: 'TelaInicialAdm',
            })}
          >
            <Text style={styles.buttonText}>AGENDAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.botaoADICIONAR_SERVICO]}
            onPress={() => navigation.navigate('ADICIONAR_SERVICO', { idUser })}
          >
            <Text style={styles.buttonText}>ADICIONAR SERVIÇO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.botaoADICIONAR_BARBEIRO]}
            onPress={() => navigation.navigate('ADICIONAR_BARBEIRO', { idUser })}
          >
            <Text style={styles.buttonText}>ADICIONAR BARBEIRO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}