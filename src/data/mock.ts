export type BillingCycle = "monthly" | "yearly";
export type CurrencyCode = "TWD" | "USD" | "EUR" | "JPY";
export type SubscriptionStatus = "active" | "paused" | "canceled";

export type Subscription = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: CurrencyCode;
  cycle: BillingCycle;
  startDate: string;
  status: SubscriptionStatus;
  vendor: string;
  note?: string;
};

export const baseCurrency: CurrencyCode = "TWD";

export const exchangeRates: Record<CurrencyCode, number> = {
  TWD: 1,
  USD: 31.2,
  EUR: 34.1,
  JPY: 0.22,
};

export const subscriptions: Subscription[] = [
  {
    id: "sub-001",
    name: "Notion Plus",
    category: "Productivity",
    price: 10,
    currency: "USD",
    cycle: "monthly",
    startDate: "2024-03-14",
    status: "active",
    vendor: "Notion",
  },
  {
    id: "sub-002",
    name: "Spotify Premium",
    category: "Entertainment",
    price: 149,
    currency: "TWD",
    cycle: "monthly",
    startDate: "2023-09-02",
    status: "active",
    vendor: "Spotify",
  },
  {
    id: "sub-003",
    name: "Figma Professional",
    category: "Design",
    price: 12,
    currency: "USD",
    cycle: "monthly",
    startDate: "2022-12-18",
    status: "active",
    vendor: "Figma",
  },
  {
    id: "sub-004",
    name: "Google Workspace",
    category: "Productivity",
    price: 2160,
    currency: "TWD",
    cycle: "yearly",
    startDate: "2021-06-05",
    status: "active",
    vendor: "Google",
  },
  {
    id: "sub-005",
    name: "ChatGPT Plus",
    category: "AI Tools",
    price: 20,
    currency: "USD",
    cycle: "monthly",
    startDate: "2024-06-11",
    status: "active",
    vendor: "OpenAI",
  },
  {
    id: "sub-006",
    name: "Nintendo Switch Online",
    category: "Gaming",
    price: 600,
    currency: "TWD",
    cycle: "yearly",
    startDate: "2020-11-23",
    status: "paused",
    vendor: "Nintendo",
  },
  {
    id: "sub-007",
    name: "Netflix Standard",
    category: "Entertainment",
    price: 320,
    currency: "TWD",
    cycle: "monthly",
    startDate: "2024-01-20",
    status: "active",
    vendor: "Netflix",
  },
  {
    id: "sub-008",
    name: "Adobe Creative Cloud",
    category: "Design",
    price: 1999,
    currency: "TWD",
    cycle: "monthly",
    startDate: "2023-04-01",
    status: "active",
    vendor: "Adobe",
  },
  {
    id: "sub-009",
    name: "Readwise",
    category: "Knowledge",
    price: 7.99,
    currency: "USD",
    cycle: "monthly",
    startDate: "2024-10-04",
    status: "active",
    vendor: "Readwise",
  },
  {
    id: "sub-010",
    name: "JetBrains All Products",
    category: "Developer Tools",
    price: 249,
    currency: "USD",
    cycle: "yearly",
    startDate: "2022-02-15",
    status: "active",
    vendor: "JetBrains",
    note: "Company plan",
  }
];

export const trendSeed = [0.92, 0.98, 1.05, 1.01, 0.97, 1.08];

export const categories = Array.from(
  new Set(subscriptions.map((item) => item.category))
);
