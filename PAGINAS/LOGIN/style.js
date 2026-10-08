import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  form: {
    width: '100%',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
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

  error: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
  },

  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1a42f0',
    fontWeight: 'bold',
  },

});

export default styles;