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
  botao: {
    width: 175,
    height: 65,
    backgroundColor: '#9D9D9D',
    borderRadius: 25,
    marginTop: 20,
  },
  botaoServiço: {
    width: 220,
    minHeight: 60,
    backgroundColor: '#9D9D9D',
    borderRadius: 20,
    marginTop: 16,
    paddingVertical: 12,
  },
  serviçoSelecionado: {
    backgroundColor: '#6F8F72',
    borderWidth: 2,
    borderColor: '#294D2D',
  },
});

export default styles;