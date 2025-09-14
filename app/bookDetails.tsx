import { useLocalSearchParams } from "expo-router";
import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../config/firebaseConfig";

export default function BookDetails() {
  const { id, title, author, publicacao, summary, genero, paginas } =
    useLocalSearchParams();

  const [rating, setRating] = useState(0);
  const [isRead, setIsRead] = useState(false);

  // 🔄 Carregar rating e status de leitura do Firebase
  useEffect(() => {
    if (!id) return;
    const bookRef = ref(database, `books/${id}`);
    const unsubscribe = onValue(bookRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRating(data.rating || 0);
        setIsRead(data.isRead || false);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // ⭐ Avaliar
  const handleRating = (star: number) => {
    setRating(star);
    if (id) {
      update(ref(database, `books/${id}`), { rating: star });
    }
  };

  // 📖 Marcar como lido/não lido
  const toggleRead = () => {
    const newStatus = !isRead;
    setIsRead(newStatus);
    if (id) {
      update(ref(database, `books/${id}`), { isRead: newStatus });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 📚 Informações do livro */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>por {author}</Text>
      <Text style={styles.genero}>Gênero: {genero}</Text>
      <Text style={styles.publicacao}>Publicado em {publicacao}</Text>
      <Text style={styles.pagina}>Nº de páginas: {paginas}</Text>

      <Text style={styles.summaryTitle}>Resumo:</Text>
      <Text style={styles.summary}>{summary}</Text>

      {/* ⭐ Avaliação */}
      <Text style={styles.sectionTitle}>Avaliação:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Text
              style={[
                styles.star,
                { color: star <= rating ? "#FFD700" : "#999" },
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>Sua avaliação: {rating} estrelas</Text>

      {/* 📖 Botão para marcar como lido */}
      <TouchableOpacity
        style={[
          styles.readButton,
          { backgroundColor: isRead ? "green" : "#0d47a1" },
        ]}
        onPress={toggleRead}
      >
        <Text style={styles.readButtonText}>
          {isRead ? "✔ Livro Lido" : "Marcar como Lido"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: "#0d47a1",
    marginBottom: 6,
  },
  genero: {
    fontSize: 16,
    color: "#0d47a1",
    marginBottom: 6,
  },
  publicacao: {
    fontSize: 14,
    color: "#0d47a1",
    marginBottom: 4,
  },
  pagina: {
    fontSize: 14,
    color: "#0d47a1",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 8,
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
    color: "#0d47a1",
    textAlign: "left",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d47a1",
    marginTop: 15,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  star: {
    fontSize: 28,
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    color: "#0d47a1",
    marginBottom: 16,
  },
  readButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  readButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
