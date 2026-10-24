import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lista: {
    width: '100%',
    maxHeight: 300,
  },
  listaConteudo: {
    alignItems: 'center',
  },
  itemBarbeiro: {
    width: '100%',
    alignItems: 'center',
  },
  botaoBarbeiro: {
    width: 175,
    height: 65,
    backgroundColor: '#9D9D9D',
    borderRadius: 25,
    marginTop: 20,
  },
  botaoExcluir: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#B3261E',
  },
  textoBotaoExcluir: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  confirmacaoExclusao: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  textoConfirmacao: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  acoesExclusao: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  botaoAcaoExclusao: {
    minWidth: 110,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  botaoCancelar: {
    backgroundColor: '#9D9D9D',
  },
  botaoConfirmarExclusao: {
    backgroundColor: '#B3261E',
  },
  textoAcaoExclusao: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoADICIONAR: {
    width: 175,
    height: 65,
    backgroundColor: '#9D9D9D',
    borderRadius: 100,
    marginTop: 20,
  },
  formulario: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  botaoConcluir: {
    width: 175,
    height: 55,
    backgroundColor: '#9D9D9D',
    borderRadius: 20,
    marginTop: 14,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  mensagem: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;