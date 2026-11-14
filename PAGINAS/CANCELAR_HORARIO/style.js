import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listaConteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  painel: {
    width: '100%',
    maxWidth: 520,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  titulo: {
    marginBottom: 16,
    color: '#000000',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemAgendamento: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
  },
  detalhesAgendamento: {
    flex: 1,
    paddingRight: 10,
  },
  horario: {
    marginBottom: 4,
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detalhe: {
    marginTop: 3,
    color: '#222222',
    fontSize: 15,
  },
  botaoExcluir: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#9B2C2C',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoExcluir: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mensagem: {
    marginTop: 8,
    color: '#222222',
    fontSize: 16,
    textAlign: 'center',
  },
  mensagemErro: {
    marginTop: 8,
    color: '#9B2C2C',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default styles;
