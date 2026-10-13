import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './PAGINAS/LOGIN/TELA_LOGIN';
import NOVOUSUARIO from './PAGINAS/NOVO USUÁRIO/CADASTRO';
import Tarefas from './PAGINAS/TAREFAS/Menu_Inicial';
import TelaInicialAdm from './PAGINAS/MENU-ADM/tela_inicial_adm';
import AdicionarBarbeiro from './PAGINAS/MENU-ADM/ADICIONAR BARBEIRO/ADICIONAR_BARBEIRO';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NOVOUSUARIO" component={NOVOUSUARIO} />
        <Stack.Screen name="Tarefas" component={Tarefas} />
        <Stack.Screen name="TelaInicialAdm" component={TelaInicialAdm} />
        <Stack.Screen name="ADICIONAR_BARBEIRO" component={AdicionarBarbeiro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
