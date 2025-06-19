import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Simulate auth state - replace with real logic (Firebase, Supabase, etc.)
const isUserLoggedIn = async () => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(false), 1000); // Simulate loading and return false
  });
};

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        router.replace('/(tabs)'); // If logged in, go to tabs
      } else {
        router.replace('/auth/login'); // Else go to login
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
