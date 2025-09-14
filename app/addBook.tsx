import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; // Importação para navegação
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genero, setGenero] = useState('');
  const [publicacao, setPublicacao] = useState('');
  const [paginas, setPaginas] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    if (!title || !author || !genero || !publicacao || !paginas || !summary) {
      setSuccessMessage('⚠️ Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      genero,
      publicacao: parseInt(publicacao),
      paginas: parseInt(paginas),
      summary,
      cover: null,
      // 🆕 campos extras
      rating: 0,
      isRead: false,
      comments: []
    };

    try {
      const stored = await AsyncStorage.getItem('customBooks');
      const books = stored ? JSON.parse(stored) : [];

      const exists = books.find(
        (b: { title: string; author: string }) =>
          b.title.toLowerCase() === newBook.title.toLowerCase() &&
          b.author.toLowerCase() === newBook.author.toLowerCase()
      );

      if (exists) {
        setSuccessMessage('⚠️ Esse livro já foi adicionado.');
        setLoading(false);
        return;
      }

      books.push(newBook);
      await AsyncStorage.setItem('customBooks', JSON.stringify(books));

      setSuccessMessage('✅ Livro adicionado com sucesso!');
      clearFormFields();
      
      // Volta para a tela anterior (BooksPage) após o sucesso
      router.back();

    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      setSuccessMessage('❌ Erro ao salvar o livro.');
    } finally {
      setLoading(false);
    }
  };

  const clearFormFields = () => {
    setTitle('');
    setAuthor('');
    setGenero('');
    setPublicacao('');
    setPaginas('');
    setSummary('');
  };

  const handleClearCustomBooks = async () => {
    try {
      await AsyncStorage.removeItem('customBooks');
      setSuccessMessage('🗑️ Todos os livros adicionados foram removidos.');
    } catch (e) {
      setSuccessMessage('❌ Erro ao apagar os livros.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adicionar Novo Livro</Text>

      {successMessage !== '' && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />
      <TextInput
        placeholder="Gênero"
        value={genero}
        onChangeText={setGenero}
        style={styles.input}
      />
      <TextInput
        placeholder="Ano de Publicação"
        value={publicacao}
        onChangeText={setPublicacao}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Número de Páginas"
        value={paginas}
        onChangeText={setPaginas}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Resumo"
        value={summary}
        onChangeText={setSummary}
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Livro</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearCustomBooks}>
        <Text style={styles.clearButtonText}>Apagar Livros Adicionados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#c62828',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});