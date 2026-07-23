import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import API from '@/api';
import LogExpenseForm from '@/components/log-expense-form';
import { Spacing } from '@/constants/theme';

type Expense = {
  id: string;
  category: string;
  amount: number;
  date?: string;
  description?: string;
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; hex: string }> = {
  Dining: { bg: '#FBE4E1', text: '#B3462F', hex: '#C0574B' },
  Rent: { bg: '#F3E4D0', text: '#8A5A2A', hex: '#2E5B3D' },
  Food: { bg: '#F1E7CE', text: '#8A6E2A', hex: '#C9962E' },
  Groceries: { bg: '#E1EEE0', text: '#3D6B3D', hex: '#4A8A4A' },
  Transport: { bg: '#DCE7F2', text: '#2E5B8A', hex: '#3A6FA5' },
  Shopping: { bg: '#F2DCE9', text: '#8A2E63', hex: '#A5407D' },
  Utilities: { bg: '#DCEFF2', text: '#2E7D8A', hex: '#3A9BA5' },
  Entertainment: { bg: '#F2ECDC', text: '#8A7A2E', hex: '#B5A03A' },
  Health: { bg: '#F2DCDC', text: '#8A2E2E', hex: '#A54040' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? { bg: '#E8E6E1', text: '#5A5750', hex: '#8A867D' };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const DONUT_SIZE = 180;
const STROKE_WIDTH = 34;
const RADIUS = (DONUT_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutChart({ categoryTotals, total }: { categoryTotals: [string, number][]; total: number }) {
  let cumulativeOffset = 0;

  return (
    <Svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
      {categoryTotals.map(([category, amount]) => {
        const fraction = total > 0 ? amount / total : 0;
        const dashLength = fraction * CIRCUMFERENCE;
        const dashOffset = -cumulativeOffset;
        cumulativeOffset += dashLength;

        return (
          <Circle
            key={category}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={RADIUS}
            stroke={getCategoryStyle(category).hex}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${dashLength} ${CIRCUMFERENCE - dashLength}`}
            strokeDashoffset={dashOffset}
            fill="none"
            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
          />
        );
      })}
    </Svg>
  );
}

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await API.get('/api/expenses/1');
      setExpenses(res.data ?? []);
      setError('');
    } catch (err) {
      console.log('Failed to load expenses:', err);
      setError("Couldn't load your ledger. Pull down to try again.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchExpenses();
      setLoading(false);
    })();
  }, [fetchExpenses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [fetchExpenses]);

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0]?.[0] ?? '—';

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoSymbol}>₹</Text>
              </View>
              <Text style={styles.logoText}>Ledger</Text>
            </View>

            <Text style={styles.pageTitle}>Your ledger</Text>
            <Text style={styles.pageSubtitle}>Every entry, tallied and categorized in one place.</Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TOTAL SPENT</Text>
                <Text style={styles.statValue}>₹{total.toFixed(2)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>ENTRIES LOGGED</Text>
                <Text style={styles.statValue}>{expenses.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TOP CATEGORY</Text>
                <Text style={styles.statValue}>{topCategory}</Text>
              </View>
            </View>

            <LogExpenseForm onExpenseAdded={fetchExpenses} />

            {sortedCategories.length > 0 && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Spending by category</Text>
                <View style={styles.chartRow}>
                  <DonutChart categoryTotals={sortedCategories} total={total} />
                  <View style={styles.legend}>
                    {sortedCategories.map(([category, amount]) => (
                      <View key={category} style={styles.legendRow}>
                        <View style={styles.legendLeft}>
                          <View
                            style={[styles.legendDot, { backgroundColor: getCategoryStyle(category).hex }]}
                          />
                          <Text style={styles.legendLabel}>{category}</Text>
                        </View>
                        <Text style={styles.legendAmount}>₹{amount.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {loading ? <Text style={styles.emptyText}>Loading…</Text> : null}
            {!loading && expenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses yet. Pull down to refresh.</Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const catStyle = getCategoryStyle(item.category);
          return (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowDescription}>{item.description || '—'}</Text>
                <View style={[styles.pill, { backgroundColor: catStyle.bg }]}>
                  <Text style={[styles.pillText, { color: catStyle.text }]}>{item.category}</Text>
                </View>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
                <Text style={styles.rowAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const BG = '#F5F3EF';
const CARD_BG = '#FFFFFF';
const INK = '#1F1B16';
const MUTED = '#8A857A';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  listContent: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two, marginBottom: Spacing.two },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFE6D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  logoSymbol: { fontSize: 14, color: '#8A6E2A', fontWeight: '700' },
  logoText: { fontSize: 18, fontWeight: '700', color: INK },
  pageTitle: { fontSize: 24, fontWeight: '700', color: INK, marginBottom: 2 },
  pageSubtitle: { fontSize: 13, color: MUTED, marginBottom: Spacing.three },
  statsRow: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  statCard: { flex: 1, backgroundColor: CARD_BG, borderRadius: 10, padding: Spacing.two },
  statLabel: { fontSize: 10, color: MUTED, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: INK },
  chartCard: { backgroundColor: CARD_BG, borderRadius: 10, padding: Spacing.two, marginBottom: Spacing.three },
  chartTitle: { fontSize: 15, fontWeight: '700', color: INK, marginBottom: Spacing.two },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  legend: { flex: 1 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 4.5 },
  legendLabel: { fontSize: 12, color: INK },
  legendAmount: { fontSize: 12, fontWeight: '600', color: INK },
  errorText: { color: '#B3462F', marginBottom: Spacing.two },
  emptyText: { textAlign: 'center', color: MUTED, marginTop: Spacing.three },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 10,
    padding: Spacing.two,
    marginBottom: Spacing.one,
  },
  rowLeft: { flex: 1, marginRight: Spacing.two },
  rowDescription: { fontSize: 14, fontWeight: '600', color: INK, marginBottom: 4 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  pillText: { fontSize: 11, fontWeight: '600' },
  rowRight: { alignItems: 'flex-end' },
  rowDate: { fontSize: 11, color: MUTED, marginBottom: 3 },
  rowAmount: { fontSize: 14, fontWeight: '700', color: INK },
});