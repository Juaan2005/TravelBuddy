import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

/**
 * MyTaskList App — Proyek Mini P07
 * Integrasi konsep P01–P06:
 *  - P02/P03: View, Text, TouchableOpacity, StyleSheet + Flexbox
 *  - P04    : useState + conditional rendering
 *  - P05    : TextInput + KeyboardAvoidingView + validasi
 *  - P06    : FlatList + keyExtractor + ListEmptyComponent
 *  - CRUD   : Add, Delete, Toggle Done
 *  - Bonus  : Prioritas (warna), Counter, Filter (Semua/Aktif/Selesai)
 */

const PRIORITIES = [
  { key: 'low',    label: 'Rendah', color: '#22c55e' },
  { key: 'medium', label: 'Sedang', color: '#f59e0b' },
  { key: 'high',   label: 'Tinggi', color: '#ef4444' },
];

const FILTERS = [
  { key: 'all',    label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'done',   label: 'Selesai' },
];

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const handleAddTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) {
      Alert.alert('Oops!', 'Tugas tidak boleh kosong. Tulis dulu ya 📝');
      return;
    }
    if (trimmed.length > 100) {
      Alert.alert('Terlalu panjang', 'Maksimal 100 karakter.');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      done: false,
      priority,
      createdAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
      }),
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskText('');
  };

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDelete = (id) => {
    Alert.alert('Hapus tugas?', 'Tugas ini akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setTasks(prev => prev.filter(t => t.id !== id)),
      },
    ]);
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.done);
    if (filter === 'done')   return tasks.filter(t =>  t.done);
    return tasks;
  }, [tasks, filter]);

  const doneCount  = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;

  const renderItem = ({ item }) => {
    const prio = PRIORITIES.find(p => p.key === item.priority);
    return (
      <View style={[styles.card, { borderLeftColor: prio.color }]}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleToggle(item.id)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkboxBox,
            item.done && { backgroundColor: prio.color, borderColor: prio.color },
          ]}>
            {item.done && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.cardBody}>
          <Text style={[styles.taskText, item.done && styles.taskTextDone]}>
            {item.text}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: prio.color + '22' }]}>
              <Text style={[styles.badgeText, { color: prio.color }]}>
                {prio.label}
              </Text>
            </View>
            <Text style={styles.timeText}>{item.createdAt}</Text>
            {item.done && (
              <View style={styles.doneBadge}>
                <Text style={styles.doneBadgeText}>Selesai</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📋 MyTaskList</Text>
          <Text style={styles.subtitle}>
            {totalCount === 0
              ? 'Belum ada tugas, tambahkan sekarang!'
              : `${doneCount} selesai dari ${totalCount} total`}
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Tulis tugas baru..."
            placeholderTextColor="#94a3b8"
            value={taskText}
            onChangeText={setTaskText}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
            maxLength={100}
          />

          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.priorityBtn,
                  priority === p.key && {
                    backgroundColor: p.color,
                    borderColor: p.color,
                  },
                ]}
                onPress={() => setPriority(p.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p.key && { color: '#fff', fontWeight: '700' },
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addBtn, !taskText.trim() && styles.addBtnDisabled]}
            onPress={handleAddTask}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>+ Tambah Tugas</Text>
          </TouchableOpacity>
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterBtn, active && styles.filterBtnActive]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            filteredTasks.length === 0
              ? styles.emptyContainer
              : { padding: 16, paddingBottom: 32 }
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🗒️</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'all'  && 'Belum ada tugas'}
                {filter === 'active' && 'Tidak ada tugas aktif'}
                {filter === 'done'   && 'Belum ada yang selesai'}
              </Text>
              <Text style={styles.emptyDesc}>
                {filter === 'all'
                  ? 'Tambahkan tugas pertamamu di atas 👆'
                  : 'Coba ganti filter untuk melihat tugas lain.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#0f172a',
  },
  title:    { fontSize: 28, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },

  inputCard: {
    marginHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  priorityText: { color: '#cbd5e1', fontSize: 13 },

  addBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: '#475569' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  filterBtnActive: { backgroundColor: '#6366f1' },
  filterText:       { color: '#94a3b8', fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  checkbox: { padding: 4, marginRight: 8 },
  checkboxBox: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: '#475569',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxTick: { color: '#fff', fontWeight: '900' },

  cardBody: { flex: 1 },
  taskText:     { color: '#f1f5f9', fontSize: 16, fontWeight: '600' },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#64748b',
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  timeText: { color: '#64748b', fontSize: 11 },
  doneBadge: {
    backgroundColor: '#22c55e22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doneBadgeText: { color: '#22c55e', fontSize: 11, fontWeight: '700' },

  deleteBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#ef444422',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
  deleteBtnText: { color: '#ef4444', fontSize: 16, fontWeight: '800' },

  emptyContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  emptyBox: { alignItems: 'center' },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: '700' },
  emptyDesc:  { color: '#94a3b8', fontSize: 14, marginTop: 6, textAlign: 'center' },
});