import type {
  CurrencyCode,
  Subscription,
} from "../data/mock";
import { exchangeRates, baseCurrency, trendSeed } from "../data/mock";

export type ChartPoint = {
  label: string;
  value: number;
};

export const toBaseCurrency = (
  amount: number,
  currency: CurrencyCode,
  target: CurrencyCode = baseCurrency
) => {
  if (currency === target) {
    return amount;
  }
  const rate = exchangeRates[currency];
  return amount * rate;
};

export const getMonthlyCost = (subscription: Subscription) => {
  const base = toBaseCurrency(subscription.price, subscription.currency);
  return subscription.cycle === "yearly" ? base / 12 : base;
};

export const buildCategoryTotals = (subscriptions: Subscription[]) => {
  const totals = subscriptions.reduce<Record<string, number>>((acc, item) => {
    const monthly = getMonthlyCost(item);
    acc[item.category] = (acc[item.category] ?? 0) + monthly;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

export const buildTrendData = (monthlySpend: number, count = 6) => {
  const now = new Date();
  const months = Array.from({ length: count }, (_, idx) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - idx), 1);
    return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  });

  return months.map((label, index) => {
    const seed = trendSeed[index % trendSeed.length] ?? 1;
    return { label, value: Math.round(monthlySpend * seed) };
  });
};

export const buildStatusTotals = (subscriptions: Subscription[]) => {
  return subscriptions.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};
