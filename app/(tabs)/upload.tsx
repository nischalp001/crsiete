'use client';

import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

interface Rating {
  id: string;
  image_url: string;
  created_at: string;
  post_id: string;
  rating: number;
  user_id: string;
}

export default function Upload() {
  const [file, setFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please allow access to the photo library.');
        return;
      }
      await fetchRatings();
    })();
  }, []);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', JSON.stringify(error, null, 2));
        Alert.alert('Error', `Failed to fetch ratings: ${error.message}`);
        return;
      }
      setRatings(data || []);
    } catch (err) {
      console.error('Unexpected fetch error:', JSON.stringify(err, null, 2));
      Alert.alert('Error', 'An unexpected error occurred while fetching ratings.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert('Info', 'Image selection canceled');
        return;
      }

      const imageUri = result.assets[0].uri;
      console.log('Selected image URI:', imageUri);
      setFile(imageUri);
    } catch (err) {
      console.error('Error picking image:', JSON.stringify(err, null, 2));
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert('Error', 'Please select an image to upload.');
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (userError || !user || sessionError || !session?.access_token) {
        console.error('Auth error:', JSON.stringify(userError || sessionError, null, 2));
        Alert.alert('Error', 'You must be logged in to upload.');
        return;
      }

      const fileExt = file.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      const fileType = `image/${fileExt}`;

      // Replace with your actual Supabase URL
      const SUPABASE_URL = 'https://dkffnvsgfijoimqytblf.supabase.co';
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/posts/${filePath}`;

      console.log('Uploading to:', uploadUrl);

      const uploadResponse = await FileSystem.uploadAsync(uploadUrl, file, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': fileType,
          'x-upsert': 'false',
        },
      });

      console.log('Upload response:', uploadResponse.status);

      if (uploadResponse.status !== 200) {
        console.error('Upload failed:', uploadResponse.body);
        Alert.alert('Error', 'Upload failed.');
        return;
      }

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(filePath);
      const imageUrl = urlData?.publicUrl;

      if (!imageUrl) {
        console.error('Failed to retrieve public URL');
        Alert.alert('Error', 'Failed to get image URL.');
        return;
      }

      const { error: insertError } = await supabase.from('ratings').insert([
        {
          post_id: fileName,
          image_url: imageUrl,
          rating: 0,
          user_id: user.id,
        },
      ]);

      if (insertError) {
        console.error('Insert error:', JSON.stringify(insertError, null, 2));
        Alert.alert('Error', `Insert failed: ${insertError.message}`);
        return;
      }

      Alert.alert('Success', 'Image uploaded successfully!');
      setFile(null);
      await fetchRatings();
    } catch (err) {
      console.error('Unexpected upload error:', JSON.stringify(err, null, 2));
      Alert.alert('Error', 'An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (ratingId: string, postId: string) => {
    try {
      console.log('Deleting file:', `public/${postId}`);
      const { error: storageError } = await supabase.storage
        .from('posts')
        .remove([`public/${postId}`]);

      if (storageError) {
        console.error('Delete error:', JSON.stringify(storageError, null, 2));
        Alert.alert('Error', `Failed to delete image: ${storageError.message}`);
        return;
      }

      const { error: dbError } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId);

      if (dbError) {
        console.error('Database delete error:', JSON.stringify(dbError, null, 2));
        Alert.alert('Error', `Failed to delete record: ${dbError.message}`);
        return;
      }

      Alert.alert('Success', 'Post deleted successfully!');
      await fetchRatings();
    } catch (err) {
      console.error('Unexpected delete error:', JSON.stringify(err, null, 2));
      Alert.alert('Error', 'An unexpected error occurred while deleting.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Image</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handlePickImage}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {file && (
        <Text style={styles.fileText}>
          Selected: {file.split('/').pop() || 'Image'}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.disabledButton]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.header, styles.recentHeader]}>Recent Uploads</Text>
      <FlatList
        data={ratings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id, item.post_id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recentHeader: {
    marginTop: 30,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    margin: 8,
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
