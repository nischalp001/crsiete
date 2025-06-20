// app/leaderboard.tsx
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type User = {
  id: string;
  username: string;
  rating: number;
};

const users: User[] = [
  { id: '1', username: 'Nischal Puri', rating: 5 },
  { id: '2', username: 'Niyati Malla', rating: 5 },
  { id: '3', username: 'Anjan Uprety', rating: 5 },
];

export default function LeaderboardScreen() {
  const sortedUsers = users.sort((a, b) => b.rating - a.rating);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
  },
  rank: {
    fontSize: 18,
    fontWeight: '600',
    width: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    width: 50,
    textAlign: 'right',
  },
});
