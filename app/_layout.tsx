import { Stack, usePathname, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../config/firebaseConfig';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Somente /login é público
  const publicRoutes = ['/login'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !publicRoutes.includes(pathname)) {
        // não logado → vai pro login
        router.replace('/login');
      } else if (user && pathname === '/login') {
        // já logado e tentando acessar login → manda pra books
        router.replace('/books');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerTitle: 'Login', headerTitleAlign: 'center' }} />
      <Stack.Screen name="books" options={{ headerTitle: 'Lista de Livros', headerTitleAlign: 'center' }} />
      <Stack.Screen name="bookDetails" options={{ headerTitle: 'Detalhes do Livro' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
