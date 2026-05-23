import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import destinations from '../data/destinations';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { destination: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardLocation}>📍 {item.location}</Text>
        <Text style={styles.cardPrice}>{item.price} / orang</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>🌏 Destinations</Text>
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3436',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#dfe6e9',
  },
  cardBody: {
    padding: 14,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00b894',
  },
});