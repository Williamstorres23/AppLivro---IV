import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function HomePage() {
  function handleClick() {
    router.push("/books");
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/LEIA.ME.png')} style={styles.logo} />

      <Text style={styles.title}>📚 Leia.Me</Text>
      <Text style={styles.subtitle}>
        Bem-vindo(a)! Descubra novos livros e mergulhe em grandes histórias.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Ver Lista de Livros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.icon,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
