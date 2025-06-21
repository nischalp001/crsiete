import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import { supabase } from '../../lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !fullName || !username || !dob) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    setUploading(true);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
          date_of_birth: dob,
        },
      },
    });

    if (signupError) {
      Alert.alert('Signup Failed', signupError.message);
      setUploading(false);
      return;
    }

    const userId = signupData.user?.id;

    let avatarUrl = '';

    if (avatarUri && userId) {
      try {
        const fileExt = avatarUri.split('.').pop() || 'jpg';
        const fileName = `${userId}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) throw new Error('No access token');

        // Fix content:// on Android
        let uri = avatarUri;
        if (!avatarUri.startsWith('file://')) {
          const tempPath = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.copyAsync({ from: avatarUri, to: tempPath });
          uri = tempPath;
        }

        const SUPABASE_URL = 'https://<YOUR_SUPABASE_PROJECT>.supabase.co'; // Replace this
        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/avatars/${filePath}`;

        const uploadResponse = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: 'PUT',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `image/${fileExt}`,
            'x-upsert': 'true',
          },
        });

        if (uploadResponse.status !== 200) {
          throw new Error('Avatar upload failed');
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = urlData?.publicUrl || '';
      } catch (err) {
        console.error('Avatar Upload Error:', err);
        Alert.alert('Warning', 'Signup successful, but avatar upload failed.');
      }
    }

    // Update user metadata with avatar URL
    if (avatarUrl && userId) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      if (updateError) {
        console.error('Metadata update error:', updateError);
      }
    }

    setUploading(false);
    Alert.alert('Success', 'Signup complete! Please log in.');
    router.replace('/auth/login');
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text>Full Name</Text>
      <TextInput value={fullName} onChangeText={setFullName} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1, marginBottom: 10 }} autoCapitalize="none" />

      <Text>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput value={dob} onChangeText={setDob} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} keyboardType="email-address" autoCapitalize="none" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 20 }} />

      <Text>Upload Avatar (optional)</Text>
      <TouchableOpacity onPress={pickAvatar} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
        <Text>Select Avatar</Text>
      </TouchableOpacity>

      {avatarUri && (
        <Image
          source={{ uri: avatarUri }}
          style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 }}
        />
      )}

      <Button title={uploading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignup} disabled={uploading} />
      <Text style={{ marginTop: 10 }} onPress={() => router.push('/auth/login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}
