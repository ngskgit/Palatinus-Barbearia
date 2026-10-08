import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './PAGINAS/LOGIN/INDEX';
import NOVOUSUARIO from './PAGINAS/NOVO USUÁRIO/CADASTRO';
import Tarefas from './PAGINAS/TAREFAS/INDEX';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NOVOUSUARIO" component={NOVOUSUARIO} />
        <Stack.Screen name="Tarefas" component={Tarefas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
