import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';

export default function DetailScreen({ route, navigation }) {
  const { destination } = route.params;
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(destination.id);

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(destination.id);
      Alert.alert('Dihapus', `${destination.name} dihapus dari favorit.`);
    } else {
      addFavorite(destination);
      Alert.alert('Ditambahkan! ❤️', `${destination.name} tersimpan di favorit.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: destination.image }} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{destination.name}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={28}
              color={favorited ? '#e17055' : '#b2bec3'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#636e72" />
          <Text style={styles.location}>{destination.location}</Text>
        </View>

        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{destination.price} / orang</Text>
        </View>

        <Text style={styles.sectionTitle}>Tentang Destinasi</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#dfe6e9',
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3436',
    flex: 1,
  },
  favBtn: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#636e72',
    marginLeft: 4,
  },
  priceTag: {
    backgroundColor: '#00b89420',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00b894',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#636e72',
    lineHeight: 22,
    marginBottom: 30,
  },
  bookBtn: {
    backgroundColor: '#00b894',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});