import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import API from '@/api';
import { Spacing } from '@/constants/theme';

const CATEGORIES = [
  'Groceries',
  'Food',
  'Dining',
  'Rent',
  'Transport',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Health',
];

export default function LogExpenseForm({ onExpenseAdded }: { onExpenseAdded: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Enter a valid amount.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await API.post('/api/expenses', {
        userId: '1',
        amount: Number(amount),
        category,
        date,
        description,
      });
      setAmount('');
      setDescription('');
      onExpenseAdded();
    } catch (err) {
      console.log('Failed to add expense:', err);
      setError("Couldn't add expense. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Log an expense</Text>

      <Text style={styles.label}>AMOUNT (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>CATEGORY</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.categoryChip, category === c && styles.categoryChipActive]}
            onPress={() => setCategory(c)}>
            <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>DATE</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />

      <Text style={styles.label}>DESCRIPTION</Text>
      <TextInput
        style={styles.input}
        placeholder="Weekly shopping"
        value={description}
        onChangeText={setDescription}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Adding…' : 'Add expense'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const CARD_BG = '#FFFFFF';
const INK = '#1F1B16';
const MUTED = '#8A857A';
const BORDER = '#E5E1D8';

const styles = StyleSheet.create({
  card: { backgroundColor: CARD_BG, borderRadius: 10, padding: Spacing.two, marginBottom: Spacing.three },
  title: { fontSize: 16, fontWeight: '700', color: INK, marginBottom: Spacing.two },
  label: { fontSize: 10, color: MUTED, fontWeight: '600', letterSpacing: 0.5, marginBottom: 5, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    color: INK,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  categoryChipActive: { backgroundColor: INK, borderColor: INK },
  categoryChipText: { fontSize: 12, color: INK },
  categoryChipTextActive: { color: '#FFF' },
  error: { color: '#B3462F', marginTop: 8 },
  button: { backgroundColor: INK, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: Spacing.two },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});