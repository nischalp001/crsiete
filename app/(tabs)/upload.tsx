import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadScreen() {
  const handleUpload = () => {
    // Logic to handle file upload (e.g., open file picker)
    console.log('Upload triggered');
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
}

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
