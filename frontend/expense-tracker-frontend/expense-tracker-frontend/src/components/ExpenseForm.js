import React, { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  "Groceries",
  "Rent",
  "Transport",
  "Utilities",
  "Dining",
  "Health",
  "Entertainment",
  "Shopping",
  "Other",
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const ExpenseForm = ({ onAdd, submitting }) => {
  const [form, setForm] = useState({
    amount: "",
    category: CATEGORIES[0],
    date: todayISO(),
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(form.amount);
    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!form.date) {
      setError("Pick a date for this expense.");
      return;
    }

    const success = await onAdd({
      amount: amountNum,
      category: form.category,
      date: form.date,
      description: form.description.trim(),
    });

    if (success) {
      setForm({
        amount: "",
        category: CATEGORIES[0],
        date: todayISO(),
        description: "",
      });
    } else {
      setError("Couldn't save that expense. Please try again.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-ledger-line bg-ledger-paper p-6 shadow-card"
    >
      <h2 className="mb-5 font-display text-lg font-semibold text-ledger-ink">
        Log an expense
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
            Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full rounded-lg border border-ledger-line bg-white px-3.5 py-2.5 font-mono text-sm text-ledger-ink outline-none transition focus:border-ledger-brass focus:ring-2 focus:ring-ledger-brass/20"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-ledger-line bg-white px-3.5 py-2.5 font-body text-sm text-ledger-ink outline-none transition focus:border-ledger-brass focus:ring-2 focus:ring-ledger-brass/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-ledger-line bg-white px-3.5 py-2.5 font-body text-sm text-ledger-ink outline-none transition focus:border-ledger-brass focus:ring-2 focus:ring-ledger-brass/20"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Weekly shopping"
            className="w-full rounded-lg border border-ledger-line bg-white px-3.5 py-2.5 font-body text-sm text-ledger-ink outline-none transition focus:border-ledger-brass focus:ring-2 focus:ring-ledger-brass/20"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 font-body text-sm text-ledger-coral">{error}</p>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-lg bg-ledger-ink py-2.5 font-body text-sm font-semibold text-ledger-paper transition hover:bg-ledger-inkSoft disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? "Saving…" : "Add expense"}
      </motion.button>
    </motion.form>
  );
};

export default ExpenseForm;
