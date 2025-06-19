import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const dummyPosts = [
  {
    id: '1',
    username: 'nischalpuri',
    avatar: 'https://i.pravatar.cc/100?img=1',
    postImage: 'https://images.pexels.com/photos/237266/pexels-photo-237266.jpeg',
  },
  {
    id: '2',
    username: 'alex_doe',
    avatar: 'https://i.pravatar.cc/100?img=2',
    postImage: 'https://www.befunky.com/images/wp/wp-2018-03-Landscape-Photography-6.jpg?auto=avif,webp&format=jpg&width=944',
  },
  {
    id: '3',
    username: 'sara_lee',
    avatar: 'https://i.pravatar.cc/100?img=3',
    postImage: 'https://iso.500px.com/wp-content/uploads/2014/06/W4A2827-1-3000x2000.jpg',
  },
];

const StarRating = ({ rating, onRate }: { rating: number; onRate: (rate: number) => void }) => {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((num) => (
        <Pressable
          key={num}
          onPress={() => onRate(num === rating ? 0 : num)}
        >
          <FontAwesome
            name={num <= rating ? 'star' : 'star-o'}
            size={30}
            color={num <= rating ? 'red' : 'black'}
            style={styles.starShadow}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default function HomeScreenContent() {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  const handleRate = (postId: string, rate: number) => {
    setRatings((prev) => ({ ...prev, [postId]: rate }));
  };

  return (
    <FlatList
      data={dummyPosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
          </View>
          <Image source={{ uri: item.postImage }} style={styles.postImage} />
          <StarRating
            rating={ratings[item.id] || 0}
            onRate={(rate) => handleRate(item.id, rate)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    backgroundColor: '#ffffff', 
    paddingHorizontal: 0,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  postImage: {
    width: '100%',
    height: SCREEN_WIDTH - 40,
    resizeMode: 'cover',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },  
  starShadow: {
    marginHorizontal: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
});
