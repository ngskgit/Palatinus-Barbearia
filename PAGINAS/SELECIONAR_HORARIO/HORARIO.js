import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './style';

const nomesMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const diasDaSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const horarios = Array.from({ length: 13 }, (_, index) => (
  `${String(index + 8).padStart(2, '0')}:00`
));

function criarDataLocal(ano, mes, dia) {
  return new Date(ano, mes, dia);
}

function formatarData(data) {
  return [
    String(data.getDate()).padStart(2, '0'),
    String(data.getMonth() + 1).padStart(2, '0'),
    data.getFullYear(),
  ].join('/');
}

export default function SelecionarHorario({ navigation, route }) {
  const hoje = criarDataLocal(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [mesExibido, setMesExibido] = useState(
    criarDataLocal(hoje.getFullYear(), hoje.getMonth(), 1),
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const primeiroDiaDoMes = mesExibido.getDay();
  const quantidadeDeDias = new Date(
    mesExibido.getFullYear(),
    mesExibido.getMonth() + 1,
    0,
  ).getDate();
  const diasDoMes = [
    ...Array(primeiroDiaDoMes).fill(null),
    ...Array.from({ length: quantidadeDeDias }, (_, index) => index + 1),
  ];
  const mesAnteriorDisponivel = (
    mesExibido.getFullYear() > hoje.getFullYear()
    || (
      mesExibido.getFullYear() === hoje.getFullYear()
      && mesExibido.getMonth() > hoje.getMonth()
    )
  );

  function alterarMes(deslocamento) {
    setMesExibido((mesAtual) => criarDataLocal(
      mesAtual.getFullYear(),
      mesAtual.getMonth() + deslocamento,
      1,
    ));
  }

  function selecionarDia(dia) {
    if (dia === null) return;

    const novaData = criarDataLocal(
      mesExibido.getFullYear(),
      mesExibido.getMonth(),
      dia,
    );
    if (novaData < hoje) return;

    setDataSelecionada(novaData);
    setHorarioSelecionado(null);
  }

  return (
    <ImageBackground
      source={require('../DESIGN/seleção_barbeiro.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>ESCOLHA A DATA E O HORÁRIO</Text>
            <Text style={styles.text}>
              Data selecionada: {formatarData(dataSelecionada)}
            </Text>

            <View style={styles.calendario}>
              <View style={styles.navegacaoCalendario}>
                <TouchableOpacity
                  style={styles.botaoMes}
                  onPress={() => alterarMes(-1)}
                  disabled={!mesAnteriorDisponivel}
                  accessibilityRole="button"
                  accessibilityLabel="Mês anterior"
                >
                  <Text style={[
                    styles.textoBotaoMes,
                    !mesAnteriorDisponivel && styles.textoDesabilitado,
                  ]}
                  >
                    {'<'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.tituloMes}>
                  {nomesMeses[mesExibido.getMonth()]} {mesExibido.getFullYear()}
                </Text>
                <TouchableOpacity
                  style={styles.botaoMes}
                  onPress={() => alterarMes(1)}
                  accessibilityRole="button"
                  accessibilityLabel="Próximo mês"
                >
                  <Text style={styles.textoBotaoMes}>{'>'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gradeCalendario}>
                {diasDaSemana.map((dia, index) => (
                  <View key={`semana-${index}`} style={styles.celulaCalendario}>
                    <Text style={styles.diaDaSemana}>{dia}</Text>
                  </View>
                ))}
                {diasDoMes.map((dia, index) => {
                  if (dia === null) {
                    return (
                      <View
                        key={`vazio-${index}`}
                        style={styles.celulaCalendario}
                      />
                    );
                  }

                  const data = criarDataLocal(
                    mesExibido.getFullYear(),
                    mesExibido.getMonth(),
                    dia,
                  );
                  const selecionado = (
                    data.getTime() === dataSelecionada.getTime()
                  );
                  const desabilitado = data < hoje;

                  return (
                    <TouchableOpacity
                      key={`dia-${dia}`}
                      style={[
                        styles.celulaCalendario,
                        styles.botaoDia,
                        selecionado && styles.diaSelecionado,
                        desabilitado && styles.diaDesabilitado,
                      ]}
                      onPress={() => selecionarDia(dia)}
                      disabled={desabilitado}
                      accessibilityRole="button"
                      accessibilityLabel={formatarData(data)}
                      accessibilityState={{
                        selected: selecionado,
                        disabled: desabilitado,
                      }}
                    >
                      <Text style={[
                        styles.textoDia,
                        selecionado && styles.textoDiaSelecionado,
                        desabilitado && styles.textoDesabilitado,
                      ]}
                      >
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text style={styles.subtitulo}>HORÁRIOS DISPONÍVEIS</Text>
            <View style={styles.listaHorarios}>
              {horarios.map((horario) => {
                const selecionado = horarioSelecionado === horario;

                return (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.botaoHorario,
                      selecionado && styles.horarioSelecionado,
                    ]}
                    onPress={() => setHorarioSelecionado(horario)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar horário ${horario}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <Text style={[
                      styles.textoHorario,
                      selecionado && styles.textoHorarioSelecionado,
                    ]}
                    >
                      {horario}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {dataSelecionada && horarioSelecionado ? (
              <TouchableOpacity
                style={[
                  styles.botaoHorario,
                  styles.horarioSelecionado,
                  {
                    marginTop: 20,
                    width: '60%',
                  },
                ]}
                onPress={() => navigation.navigate('Tarefas', {
                  idUser: route?.params?.idUser,
                })}
                accessibilityRole="button"
                accessibilityLabel="Confirmar agendamento e voltar para a área inicial"
              >
                <Text style={styles.textoHorarioSelecionado}>CONTINUAR</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
