import { useMemo, useState } from "react";
import { baseCurrency, exchangeRates } from "../data/mock";
import {
  buildCategoryTotals,
  buildTrendData,
  getMonthlyCost,
} from "../utils/metrics";
import { formatCurrency } from "../utils/format";
import ChartCard from "../components/ChartCard";
import DonutChart from "../components/DonutChart";
import TrendChart from "../components/TrendChart";
import CategoryBars from "../components/CategoryBars";
import SectionHeader from "../components/SectionHeader";
import type { SubscriptionRow } from "../components/SubscriptionTable";

const DONUT_COLORS = [
  "#49d3a4",
  "#f2c94c",
  "#4da3ff",
  "#ff8c70",
  "#7ee2c1",
];

const TREND_MONTHS_OPTIONS = [3, 6, 12] as const;

export type AnalyticsPageProps = {
  enriched: SubscriptionRow[];
  onOpenMenu?: () => void;
};

const AnalyticsPage = ({ enriched, onOpenMenu }: AnalyticsPageProps) => {
  const [trendMonths, setTrendMonths] = useState<number>(6);

  const activeSubscriptions = enriched.filter((item) => item.status === "active");
  const monthlySpend = activeSubscriptions.reduce(
    (sum, item) => sum + getMonthlyCost(item),
    0
  );
  const yearlySpend = monthlySpend * 12;
  const averageSpend =
    activeSubscriptions.length === 0
      ? 0
      : monthlySpend / activeSubscriptions.length;

  const categoryTotals = buildCategoryTotals(activeSubscriptions);
  const donutData = categoryTotals.slice(0, 5).map((item, index) => ({
    ...item,
    color: DONUT_COLORS[index % DONUT_COLORS.length],
  }));

  const trendData = useMemo(
    () => buildTrendData(monthlySpend, trendMonths),
    [monthlySpend, trendMonths]
  );

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Analytics</h2>
          <p>
            Deep dive into your subscription spend. Category breakdown and
            trends.
          </p>
        </div>
        <div className="topbar-actions">
          <button
            className="ghost-button mobile-only"
            onClick={onOpenMenu}
          >
            Menu
          </button>
        </div>
      </header>

      <section className="analytics-kpis">
        <div className="analytics-kpi-card">
          <span className="analytics-kpi-label">Total active</span>
          <strong className="analytics-kpi-value">
            {activeSubscriptions.length}
          </strong>
          <span className="analytics-kpi-helper">subscriptions</span>
        </div>
        <div className="analytics-kpi-card">
          <span className="analytics-kpi-label">Monthly spend</span>
          <strong className="analytics-kpi-value" data-mono>
            {formatCurrency(Math.round(monthlySpend), baseCurrency)}
          </strong>
          <span className="analytics-kpi-helper">avg{" "}
            {formatCurrency(Math.round(averageSpend), baseCurrency)} per sub</span>
        </div>
        <div className="analytics-kpi-card">
          <span className="analytics-kpi-label">Yearly projection</span>
          <strong className="analytics-kpi-value" data-mono>
            {formatCurrency(Math.round(yearlySpend), baseCurrency)}
          </strong>
          <span className="analytics-kpi-helper">converted to {baseCurrency}</span>
        </div>
      </section>

      <section className="analytics-charts">
        <div className="analytics-chart-row">
          <ChartCard
            title="Monthly spend by category"
            subtitle="Converted into TWD"
          >
            <DonutChart data={donutData} totalLabel="Monthly" />
          </ChartCard>
          <ChartCard title="Category breakdown" subtitle="All categories">
            <CategoryBars data={categoryTotals} />
          </ChartCard>
        </div>

        <section className="table-section">
          <SectionHeader
            title="Spend trend"
            subtitle={`Last ${trendMonths} months · Exchange rates: USD ${exchangeRates.USD} · EUR ${exchangeRates.EUR} · JPY ${exchangeRates.JPY}`}
            action={
              <div className="trend-months-selector">
                {TREND_MONTHS_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`ghost-button trend-months-btn${trendMonths === n ? " active" : ""}`}
                    onClick={() => setTrendMonths(n)}
                  >
                    {n}m
                  </button>
                ))}
              </div>
            }
          />
          <div className="card">
            <div className="chart-body">
              <TrendChart data={trendData} />
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default AnalyticsPage;
