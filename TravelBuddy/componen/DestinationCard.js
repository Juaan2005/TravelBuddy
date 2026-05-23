import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const formatPrice = (n) =>
  'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const DestinationCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.image}>{item.image}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color="#6b7280" />
          <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="star" size={13} color="#f59e0b" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#e6fff7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  image: { fontSize: 36 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  location: { fontSize: 12, color: '#6b7280', marginLeft: 2 },
  rating: { fontSize: 12, color: '#f59e0b', fontWeight: '600', marginLeft: 2 },
  price: { fontSize: 14, fontWeight: '800', color: '#00b894', marginTop: 4 },
});

export default DestinationCard;
