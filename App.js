import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './PAGINAS/LOGIN/TELA_LOGIN';
import NOVOUSUARIO from './PAGINAS/NOVO USUÁRIO/CADASTRO';
import Tarefas from './PAGINAS/TAREFAS/Menu_Inicial';
import TelaInicialAdm from './PAGINAS/MENU-ADM/tela_inicial_adm';
import TelaVerAgendamentos from './PAGINAS/MENU-ADM/VER AGENDAMENTOS/tela_ver_agendamentos';
import AdicionarBarbeiro from './PAGINAS/MENU-ADM/ADICIONAR BARBEIRO/ADICIONAR_BARBEIRO';
import AdicionarServico from './PAGINAS/MENU-ADM/ADICIONAR SERVIÇO/ADICIONAR_SERVIÇO.js';
import SelecionarBarbeiro from './PAGINAS/TELA AGENDAMENTO/BARBEIRO';
import SelecionarServico from './PAGINAS/TELA_SELECIONAR_SERVIÇO/SERVIÇO';
import SelecionarHorario from './PAGINAS/SELECIONAR_HORARIO/HORARIO';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NOVOUSUARIO" component={NOVOUSUARIO} />
        <Stack.Screen name="Tarefas" component={Tarefas} />
        <Stack.Screen name="SERVICOS" component={SelecionarServico} />
        <Stack.Screen name="BARBEIROS" component={SelecionarBarbeiro} />
        <Stack.Screen name="HORARIO" component={SelecionarHorario} />
        <Stack.Screen name="TelaInicialAdm" component={TelaInicialAdm} />
        <Stack.Screen name="TELA_VER_AGENDAMENTOS" component={TelaVerAgendamentos} />
        <Stack.Screen name="ADICIONAR_SERVICO" component={AdicionarServico} />
        <Stack.Screen name="ADICIONAR_BARBEIRO" component={AdicionarBarbeiro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
