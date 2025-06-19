import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UploadScreen: React.FC = () => {
  const handleUpload = async () => {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow access to your gallery');
      return;
    }

    // Open the gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri: string = result.assets[0].uri;
      console.log('Selected image URI:', imageUri);
      // Handle the image (e.g., upload to server or display)
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Uploads</Text>
      <Text style={styles.oops}>OOPS!</Text>
      <Text style={styles.subtitle}>No Contents Yet...</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

      <Text style={styles.uploadText}>Click here to add your content</Text>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  oops: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  uploadButton: {
    width: 350,
    height: 350,
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  plus: {
    fontSize: 40,
    color: '#000',
  },
  uploadText: {
    fontSize: 16,
    color: '#007AFF',
  },
});