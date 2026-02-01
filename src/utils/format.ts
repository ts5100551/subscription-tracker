import type { CurrencyCode } from "../data/mock";

export const formatCurrency = (
  amount: number,
  currency: CurrencyCode = "TWD",
  fractionDigits = 0
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatShortDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const formatCycle = (cycle: string) =>
  cycle === "yearly" ? "Yearly" : "Monthly";
