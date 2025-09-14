import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, database } from '../config/firebaseConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'O e-mail informado não é válido.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/email-already-in-use':
        return 'E-mail já está em uso.';
      default:
        return 'Erro ao autenticar. Tente novamente.';
    }
  };

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      console.log('Usuário registrado e salvo no DB:', user.email);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.replace('/books');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Conta já existe, tentando login automático...');
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, senha);
          console.log('Usuário existente logado:', userCredential.user.email);
          router.replace('/books');
        } catch (loginError: any) {
          console.log('Erro ao logar usuário existente:', loginError);
          Alert.alert('Erro', 'Este e-mail já está em uso. Tente fazer login.');
        }
      } else {
        console.log('Erro no registro:', error);
        Alert.alert('Erro no registro', getErrorMessage(error.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log('Usuário logado:', userCredential.user.email);
      router.replace('/books');
    } catch (error: any) {
      console.log('Erro no login:', error);
      Alert.alert('Erro no login', getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Nova função para recuperação de senha
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail para recuperar a senha.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir sua senha.');
    } catch (error: any) {
      console.log('Erro ao enviar e-mail de recuperação:', error);
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação. Verifique se o e-mail está correto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LivroApp 📚</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1a237e" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePasswordReset}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1a237e',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#1a237e',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});