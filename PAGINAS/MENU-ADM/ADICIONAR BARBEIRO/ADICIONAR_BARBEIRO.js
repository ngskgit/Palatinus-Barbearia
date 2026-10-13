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
          <View style={[styles.button, styles.botaoBABEIRO01]}>
            <Text style={styles.buttonText}>BARBEIRO01</Text>
          </View>
          <View style={[styles.button, styles.botaoBARBEIRO02]}>
            <Text style={styles.buttonText}>BARBEIRO02</Text>
          </View>
          <View style={[styles.button, styles.ADICIONAR]}>
            <Text style={styles.buttonText}>+</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
