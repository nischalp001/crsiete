import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !fullName || !username || !dob) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          date_of_birth: dob,
        },
      },
    });

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert('Success', 'Signup complete! Please log in.');
      router.replace('/auth/login'); // redirect to login screen
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10 }}
        autoCapitalize="none"
      />

      <Text>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput
        value={dob}
        onChangeText={setDob}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={{ marginTop: 10 }} onPress={() => router.push('/auth/login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}
