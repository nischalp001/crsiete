import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<{
    full_name: string;
    username: string;
    date_of_birth: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const handleChangePhoto = () => {
    console.log('Change photo triggered');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error fetching user:', error.message);
      } else {
        const meta = data.user?.user_metadata;
        setProfile({
          full_name: meta?.full_name ?? 'Unknown',
          username: meta?.username ?? 'Unknown',
          date_of_birth: meta?.date_of_birth ?? 'Unknown',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Image style={styles.avatar} source={{ uri: 'https://via.placeholder.com/150' }} />
      <TouchableOpacity style={styles.changePhoto} onPress={handleChangePhoto}>
        <Text style={styles.changeText}>Change photo</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{profile?.full_name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{profile?.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>DOB:</Text>
        <Text style={styles.value}>{profile?.date_of_birth}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhoto: {
    marginBottom: 20,
  },
  changeText: {
    color: '#007AFF',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '80%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    width: '40%',
  },
  value: {
    fontSize: 16,
    color: '#000',
    width: '60%',
  },
});
