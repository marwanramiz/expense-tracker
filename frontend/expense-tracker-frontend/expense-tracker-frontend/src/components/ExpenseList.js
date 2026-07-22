import React from "react";
import { motion } from "framer-motion";
import "../styles/dashboard.css";

const CATEGORY_COLORS = {
  Groceries: { bg: "#EAF3EC", text: "#2F6F4E" },
  Rent: { bg: "#EFE6D8", text: "#8F6B1E" },
  Transport: { bg: "#E4EEF4", text: "#2E6580" },
  Utilities: { bg: "#EFEAF6", text: "#6A4C93" },
  Dining: { bg: "#FBEAE8", text: "#C1524B" },
  Health: { bg: "#E7F4EF", text: "#1F7A5C" },
  Entertainment: { bg: "#FDEFE0", text: "#B5701E" },
  Shopping: { bg: "#F4E8F1", text: "#9A3E7B" },
  Other: { bg: "#EAECEB", text: "#33454F" },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const ExpenseList = ({ expenses, loading }) => {
  if (loading) {
    return (
      <div className="ledger-sheet flex items-center justify-center py-16">
        <span className="font-body text-sm text-ledger-inkSoft">
          Loading your ledger…
        </span>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="ledger-sheet flex flex-col items-center justify-center gap-2 py-16 text-center">
        <span className="font-display text-lg text-ledger-ink">
          No entries yet
        </span>
        <span className="max-w-xs font-body text-sm text-ledger-inkSoft">
          Add your first expense above and it'll show up here.
        </span>
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="ledger-sheet overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-ledger-line px-6 py-3 font-body text-xs font-semibold uppercase tracking-wide text-ledger-inkSoft sm:grid-cols-[1.2fr_1fr_auto_auto]">
        <span>Description</span>
        <span className="hidden sm:block">Category</span>
        <span className="hidden sm:block">Date</span>
        <span className="text-right">Amount</span>
      </div>

      <ul>
        {sorted.map((exp, i) => {
          const colors = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other;
          return (
            <motion.li
              key={exp.id || `${exp.description}-${exp.date}-${i}`}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
              className="ledger-row grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 sm:grid-cols-[1.2fr_1fr_auto_auto]"
            >
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-medium text-ledger-ink">
                  {exp.description || "—"}
                </p>
                <span
                  className="category-chip mt-1 inline-block sm:hidden"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {exp.category}
                </span>
              </div>

              <div className="hidden sm:block">
                <span
                  className="category-chip"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {exp.category}
                </span>
              </div>

              <span className="hidden font-body text-sm text-ledger-inkSoft sm:block">
                {formatDate(exp.date)}
              </span>

              <span className="figure text-right text-sm font-semibold text-ledger-ink">
                {formatCurrency(exp.amount)}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;
