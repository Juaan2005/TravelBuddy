import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';

// ─── Warna tema aplikasi ───────────────────────────────────────────────────
const COLORS = {
  bg: '#F5F7FA',
  card: '#FFFFFF',
  primary: '#2563EB',
  masuk: '#16A34A',
  masukLight: '#DCFCE7',
  keluar: '#DC2626',
  keluarLight: '#FEE2E2',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  inputBg: '#F9FAFB',
  shadow: 'rgba(0,0,0,0.06)',
};

// ─── Helper: format angka ke Rupiah ───────────────────────────────────────
const formatRupiah = (angka) => {
  const abs = Math.abs(angka);
  return 'Rp ' + abs.toLocaleString('id-ID');
};

// ─── Helper: format waktu sekarang ────────────────────────────────────────
const getWaktu = () => {
  const now = new Date();
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const tgl = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${jam} · ${tgl}`;
};

// ─── Data awal (contoh) ───────────────────────────────────────────────────
const DATA_AWAL = [
  { id: '1', ket: 'Uang Saku', nominal: 100000, tipe: 'masuk', waktu: '08:00 · 13 Mei 2025' },
  { id: '2', ket: 'Beli Cilok', nominal: 10000, tipe: 'keluar', waktu: '10:30 · 13 Mei 2025' },
];

// ─── Komponen: Item Transaksi (dipakai di FlatList) ───────────────────────
const TransaksiItem = ({ item, index }) => {
  const isMasuk = item.tipe === 'masuk';

  return (
    <View style={[styles.itemCard, index === 0 && { marginTop: 0 }]}>
      {/* Ikon tipe transaksi */}
      <View
        style={[
          styles.itemIcon,
          { backgroundColor: isMasuk ? COLORS.masukLight : COLORS.keluarLight },
        ]}
      >
        <Text style={{ fontSize: 16, color: isMasuk ? COLORS.masuk : COLORS.keluar }}>
          {isMasuk ? '↑' : '↓'}
        </Text>
      </View>

      {/* Keterangan & waktu */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemKet} numberOfLines={1}>
          {item.ket}
        </Text>
        <Text style={styles.itemWaktu}>{item.waktu}</Text>
      </View>

      {/* Nominal berwarna sesuai tipe */}
      <Text
        style={[
          styles.itemNominal,
          { color: isMasuk ? COLORS.masuk : COLORS.keluar },
        ]}
      >
        {isMasuk ? '+' : '-'}
        {formatRupiah(item.nominal)}
      </Text>
    </View>
  );
};

// ─── Komponen: Header Saldo ───────────────────────────────────────────────
const HeaderSaldo = ({ saldo, totalMasuk, totalKeluar }) => {
  const saldoPositif = saldo >= 0;

  return (
    <View style={styles.saldoContainer}>
      <Text style={styles.saldoLabel}>Total Saldo</Text>
      <Text
        style={[
          styles.saldoNilai,
          { color: saldoPositif ? COLORS.masuk : COLORS.keluar },
        ]}
      >
        {saldo < 0 ? '-' : ''}
        {formatRupiah(saldo)}
      </Text>

      {/* Ringkasan Masuk & Keluar */}
      <View style={styles.ringkasanRow}>
        <View style={styles.ringkasanItem}>
          <Text style={[styles.ringkasanLabel, { color: COLORS.masuk }]}>↑ Pemasukan</Text>
          <Text style={[styles.ringkasanNilai, { color: COLORS.masuk }]}>
            {formatRupiah(totalMasuk)}
          </Text>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.ringkasanItem}>
          <Text style={[styles.ringkasanLabel, { color: COLORS.keluar }]}>↓ Pengeluaran</Text>
          <Text style={[styles.ringkasanNilai, { color: COLORS.keluar }]}>
            {formatRupiah(totalKeluar)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Komponen: Form Input Transaksi ──────────────────────────────────────
const FormTransaksi = ({ onTambah }) => {
  const [ket, setKet] = useState('');
  const [nominal, setNominal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validasi = () => {
    if (!ket.trim()) {
      setErrorMsg('Deskripsi tidak boleh kosong!');
      return false;
    }
    const n = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!n || n <= 0) {
      setErrorMsg('Nominal harus angka lebih dari 0!');
      return false;
    }
    setErrorMsg('');
    return { ket: ket.trim(), nominal: n };
  };

  const handleTambah = (tipe) => {
    const data = validasi();
    if (!data) return;
    onTambah({ ...data, tipe });
    setKet('');
    setNominal('');
    setErrorMsg('');
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formJudul}>Tambah Transaksi</Text>

      {/* Input Deskripsi */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Deskripsi</Text>
        <TextInput
          style={styles.input}
          placeholder="cth: Beli Makan, Uang Bulanan..."
          placeholderTextColor={COLORS.textMuted}
          value={ket}
          onChangeText={(t) => { setKet(t); setErrorMsg(''); }}
          returnKeyType="next"
          maxLength={50}
        />
      </View>

      {/* Input Nominal */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nominal (Rp)</Text>
        <TextInput
          style={styles.input}
          placeholder="cth: 50000"
          placeholderTextColor={COLORS.textMuted}
          value={nominal}
          onChangeText={(t) => { setNominal(t); setErrorMsg(''); }}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={12}
        />
      </View>

      {/* Pesan error */}
      {errorMsg !== '' && (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      )}

      {/* 2 Tombol: Pemasukan & Pengeluaran */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnMasuk]}
          onPress={() => handleTambah('masuk')}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, { color: COLORS.masuk }]}>+ Pemasukan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnKeluar]}
          onPress={() => handleTambah('keluar')}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, { color: COLORS.keluar }]}>− Pengeluaran</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Komponen Utama: App ──────────────────────────────────────────────────
export default function App() {
  const [transaksi, setTransaksi] = useState(DATA_AWAL);
  const idRef = useRef(DATA_AWAL.length + 1);

  // Hitung saldo: masuk = tambah, keluar = kurang
  const saldo = transaksi.reduce((acc, t) =>
    t.tipe === 'masuk' ? acc + t.nominal : acc - t.nominal, 0
  );

  const totalMasuk = transaksi
    .filter((t) => t.tipe === 'masuk')
    .reduce((acc, t) => acc + t.nominal, 0);

  const totalKeluar = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((acc, t) => acc + t.nominal, 0);

  const handleTambah = ({ ket, nominal, tipe }) => {
    const baru = {
      id: String(idRef.current++),
      ket,
      nominal,
      tipe,
      waktu: getWaktu(),
    };
    // Tambahkan di paling atas list
    setTransaksi((prev) => [baru, ...prev]);
  };

  // ─── Header FlatList (Saldo + Form) ─────────────────────────────────
  const ListHeader = () => (
    <>
      <HeaderSaldo
        saldo={saldo}
        totalMasuk={totalMasuk}
        totalKeluar={totalKeluar}
      />
      <FormTransaksi onTambah={handleTambah} />
      <View style={styles.riwayatHeader}>
        <Text style={styles.riwayatJudul}>Riwayat Transaksi</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>{transaksi.length} transaksi</Text>
        </View>
      </View>
    </>
  );

  // ─── Tampilan kosong ──────────────────────────────────────────────────
  const ListKosong = () => (
    <View style={styles.kosong}>
      <Text style={styles.kosongIkon}>📭</Text>
      <Text style={styles.kosongTeks}>Belum ada transaksi.</Text>
      <Text style={styles.kosongSub}>Tambahkan transaksi pertamamu!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>💰 Expense Tracker</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* FlatList utama: menampilkan semua transaksi */}
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TransaksiItem item={item} index={index} />
          )}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={<ListKosong />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // App Bar
  appBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  // FlatList
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // ── Header Saldo ──
  saldoContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  saldoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  saldoNilai: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  ringkasanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  ringkasanItem: {
    flex: 1,
    alignItems: 'center',
  },
  ringkasanLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  ringkasanNilai: {
    fontSize: 15,
    fontWeight: '700',
  },
  dividerVertical: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  // ── Form ──
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  formJudul: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorMsg: {
    fontSize: 12,
    color: COLORS.keluar,
    marginBottom: 8,
    marginTop: -4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  btnMasuk: {
    backgroundColor: COLORS.masukLight,
    borderColor: '#86EFAC',
  },
  btnKeluar: {
    backgroundColor: COLORS.keluarLight,
    borderColor: '#FCA5A5',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Header Riwayat ──
  riwayatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  riwayatJudul: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  badgeCount: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // ── Item Transaksi ──
  itemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemKet: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemWaktu: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  itemNominal: {
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Kosong ──
  kosong: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  kosongIkon: {
    fontSize: 40,
    marginBottom: 10,
  },
  kosongTeks: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  kosongSub: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});