'use client';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDB, initDB } from '../../lib/database';

interface Rating {
  id: number;
  image_uri: string;
  rating: number;
  created_at: string;
}

export default function UploadScreen() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const db = getDB();

  useEffect(() => {
    initDB();
    fetchRatings();
  }, []);

  const fetchRatings = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ratings ORDER BY created_at DESC;',
        [],
        (_, { rows }) => {
          setRatings(rows._array);
        }
      );
    });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      // Save image URI to database
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO ratings (image_uri, rating) VALUES (?, ?);',
          [imageUri, 0],
          () => fetchRatings(),
          (_, err) => {
            console.error('Insert error:', err);
            return false;
          }
        );
      });
    }
  };

  const handleDelete = (id: number) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM ratings WHERE id = ?;',
        [id],
        () => fetchRatings(),
        (_, err) => {
          console.error('Delete error:', err);
          return false;
        }
      );
    });
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Button title="Pick Image" onPress={handlePickImage} />

      <FlatList
        data={ratings}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_uri }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
