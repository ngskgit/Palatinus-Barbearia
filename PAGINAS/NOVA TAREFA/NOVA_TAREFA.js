import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { auth, database } from '../../firebaseConfig';
import styles from './style';

export default function Tarefas({ navigation, route }) {
  const [tarefas, setTarefas] = useState([]);
  const usuarioID = route?.params?.idUser ?? auth.currentUser?.uid;

  useEffect(() => {
    if (!usuarioID) {
      setTarefas([]);
      return undefined;
    }

    const tarefasCol = collection(database, 'tarefas');
    const tarefasQuery = query(tarefasCol, where('idUser', '==', usuarioID));
    const unsubscribe = onSnapshot(
      tarefasQuery,
      (snapshot) => {
        setTarefas(snapshot.docs.map((tarefaDoc) => ({
          id: tarefaDoc.id,
          ...tarefaDoc.data(),
        })));
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
      },
    );

    return unsubscribe;
  }, [usuarioID]);

  async function deleteTarefa(id) {
    try {
      await deleteDoc(doc(database, 'tarefas', id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }

  async function logOut() {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <SafeAreaView style={styles.conteudo}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.Tarefas}>
            <TouchableOpacity
              style={styles.deletartarefa}
              onPress={() => deleteTarefa(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Excluir tarefa"
            >
              <FontAwesome name="trash" size={25} color="#1A42F0" style={styles.Icone} />
            </TouchableOpacity>
            <Text
              style={styles.TextoDescricao}
              onPress={() => navigation.navigate('DETALHE DA TAREFA', {
                id: item.id,
                descricao_tarefa: item.descricao_tarefa,
                idUser: usuarioID,
              })}
            >
              {item.descricao_tarefa}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botaoNovaTarefa}
        onPress={() => navigation.navigate('NOVA TAREFA', { idUser: usuarioID })}
        accessibilityRole="button"
        accessibilityLabel="Criar nova tarefa"
      >
        <Text style={styles.iconeAdd}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logOut}
        accessibilityRole="button"
        accessibilityLabel="Sair"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="logout" size={30} color="#dd0f0f" style={styles.Icone} />
          <Text>SAIR</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
