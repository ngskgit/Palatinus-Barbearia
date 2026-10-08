import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  //TITULO DA PAGINA
  textoTitulo: {
    fontSize: 30,
    color: '#000000',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  
  input: {
    width: '100%',
    maxWidth: 300,
    marginTop: 15,
    padding: 10,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderBottomColor: '#1a42f0',
    borderBottomWidth: 2,
    color: 'black',
  },

  //BOTÃO DE CADASTRO
  botaoCadastro: {
    width: 175,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9D9D9D',
    borderRadius: 25,
    marginTop: 20,
  },
  textoBotaoCadastro: {
    color: '#fff',
    fontSize: 20,
  },
  conteudoAlerta: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoAlerta: {
    paddingLeft: 10,
    color: 'red',
    fontSize: 15,
  },
  registrar: {
    marginTop: 15,
  },
  linkcadastrar: {
    color: '#1a42f0',
    fontSize: 15,
  },
});

export default styles;