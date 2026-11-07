import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
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
  content: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  avisoAgenda: {
    maxWidth: 360,
    marginBottom: 12,
    color: '#9B2C2C',
    fontSize: 15,
    fontWeight: 'bold',
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
  diaDesabilitado: {
    opacity: 0.4,
  },
  textoDia: {
    fontSize: 15,
  },
  textoDiaSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textoDesabilitado: {
    color: '#777777',
  },
  subtitulo: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  listaHorarios: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  campoCliente: {
    width: '100%',
    maxWidth: 360,
    marginTop: 16,
  },
  inputCliente: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  botaoHorario: {
    width: '30%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.5%',
    borderRadius: 12,
    backgroundColor: '#D5D5D5',
  },
  horarioSelecionado: {
    backgroundColor: '#294D2D',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  textoHorario: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoHorarioSelecionado: {
    color: '#FFFFFF',
  },
});

export default styles;
