import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Simulate auth state - replace with actual Supabase/Firebase check later
const isUserLoggedIn = async () => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(false), 500); // Simulate user NOT logged in
  });
};

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Delay to ensure navigation stack is ready (important on mobile)
      await new Promise((res) => setTimeout(res, 100));

      const loggedIn = await isUserLoggedIn();

      if (loggedIn) {
        router.replace('/(tabs)'); // Authenticated: go to main app
      } else {
        router.replace('/auth/login'); // Not authenticated: go to login
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
