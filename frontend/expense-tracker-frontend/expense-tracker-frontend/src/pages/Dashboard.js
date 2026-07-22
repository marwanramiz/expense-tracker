import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { useAuth } from "../context/AuthContext";
import { addExpense, getExpenses } from "../api/api";
import "../styles/dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  "#2F6F4E",
  "#B98B2A",
  "#C1524B",
  "#2E6580",
  "#6A4C93",
  "#B5701E",
  "#1F7A5C",
  "#9A3E7B",
  "#33454F",
];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const Dashboard = () => {
  const { userId } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const fetchExpenses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setLoadError("");
    try {
      const res = await getExpenses(userId);
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setLoadError("Couldn't load expenses. Is the backend running on :8080?");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async (expense) => {
    setSubmitting(true);
    try {
      const payload = { ...expense, userId };
      const res = await addExpense(payload);
      const saved = res?.data && typeof res.data === "object" ? res.data : payload;
      setExpenses((prev) => [saved, ...prev]);
      return true;
    } catch (err) {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const { total, byCategory, chartData } = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const byCategory = expenses.reduce((acc, e) => {
      const cat = e.category || "Other";
      acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
      return acc;
    }, {});
    const labels = Object.keys(byCategory);
    const chartData = {
      labels,
      datasets: [
        {
          data: labels.map((l) => byCategory[l]),
          backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderColor: "#F7F9F7",
          borderWidth: 2,
        },
      ],
    };
    return { total, byCategory, chartData };
  }, [expenses]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(byCategory);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [byCategory]);

  return (
    <div className="min-h-screen bg-ledger-bg pb-20">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-semibold text-ledger-ink">
            Your ledger
          </h1>
          <p className="mt-1 font-body text-sm text-ledger-inkSoft">
            Every entry, tallied and categorized in one place.
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-card"
          >
            <p className="font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
              Total spent
            </p>
            <p className="figure mt-2 text-2xl font-semibold text-ledger-ink">
              {formatCurrency(total)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-card"
          >
            <p className="font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
              Entries logged
            </p>
            <p className="figure mt-2 text-2xl font-semibold text-ledger-ink">
              {expenses.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-ledger-line bg-ledger-paper p-5 shadow-card"
          >
            <p className="font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
              Top category
            </p>
            <p className="mt-2 text-2xl font-semibold text-ledger-ink">
              {topCategory ? topCategory[0] : "—"}
            </p>
          </motion.div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ExpenseForm onAdd={handleAdd} submitting={submitting} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-ledger-line bg-ledger-paper p-6 shadow-card lg:col-span-3"
          >
            <h2 className="mb-4 self-start font-display text-lg font-semibold text-ledger-ink">
              Spending by category
            </h2>
            {expenses.length === 0 ? (
              <p className="py-10 font-body text-sm text-ledger-inkSoft">
                Add expenses to see your breakdown.
              </p>
            ) : (
              <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
                <div className="h-56 w-56 shrink-0">
                  <Doughnut
                    data={chartData}
                    options={{
                      plugins: {
                        legend: { display: false },
                      },
                      cutout: "68%",
                    }}
                  />
                </div>
                <ul className="w-full space-y-2">
                  {Object.entries(byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amount], i) => (
                      <li
                        key={cat}
                        className="flex items-center justify-between font-body text-sm"
                      >
                        <span className="flex items-center gap-2 text-ledger-inkSoft">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: PALETTE[i % PALETTE.length],
                            }}
                          />
                          {cat}
                        </span>
                        <span className="figure font-medium text-ledger-ink">
                          {formatCurrency(amount)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {loadError && (
          <p className="mb-4 font-body text-sm text-ledger-coral">{loadError}</p>
        )}

        <ExpenseList expenses={expenses} loading={loading} />
      </main>
    </div>
  );
};

export default Dashboard;
