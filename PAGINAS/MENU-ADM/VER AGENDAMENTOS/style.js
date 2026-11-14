import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  painelAgenda: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  tituloAgenda: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textoAgenda: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  calendario: {
    width: '100%',
    maxWidth: 360,
  },
  navegacaoCalendario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  botaoMes: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoMes: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tituloMes: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  gradeCalendario: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  celulaCalendario: {
    width: '14.2857%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaDaSemana: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoDia: {
    borderRadius: 21,
  },
  diaSelecionado: {
    backgroundColor: '#294D2D',
  },
  textoDia: {
    fontSize: 15,
  },
  textoDiaSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  estadoAgenda: {
    width: '100%',
    maxWidth: 360,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
    borderRadius: 10,
  },
  estadoAgendaAberta: {
    backgroundColor: '#DDF2E1',
  },
  estadoAgendaSuspensa: {
    backgroundColor: '#FCE1E1',
  },
  estadoAgendaCarregando: {
    backgroundColor: '#EEEEEE',
  },
  estadoAgendaErro: {
    backgroundColor: '#FFF0D6',
  },
  textoEstadoAgenda: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoSuspensao: {
    minHeight: 48,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
    borderRadius: 12,
  },
  botaoSuspender: {
    backgroundColor: '#9B2C2C',
  },
  botaoReabrir: {
    backgroundColor: '#294D2D',
  },
  textoBotaoSuspensao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avisoSuspensao: {
    width: '100%',
    maxWidth: 360,
    marginTop: 10,
    color: '#9B2C2C',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mensagem: {
    marginTop: 10,
    color: '#294D2D',
    textAlign: 'center',
  },
  mensagemErro: {
    marginTop: 10,
    color: '#9B2C2C',
    textAlign: 'center',
  },
  subtituloAgenda: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  itemAgendamento: {
    width: '100%',
    maxWidth: 360,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  horarioAgendamento: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detalheAgendamento: {
    fontSize: 15,
    marginTop: 2,
  },
  botaoExcluirAgendamento: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#9B2C2C',
  },
  botaoExcluirAgendamentoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoExcluirAgendamento: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
