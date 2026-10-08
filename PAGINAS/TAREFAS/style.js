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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoAGENDAMENTO: {
    width: 175,
    height: 65,
    backgroundColor: '#63f13f',
    borderRadius: 25,
    marginTop: 20,
  },

  botaoCANCELAMENTO: {
    width: 175,
    height: 65,
    backgroundColor: '#f13f3f',
    borderRadius: 25,
    marginTop: 20,
  },
});

export default styles;