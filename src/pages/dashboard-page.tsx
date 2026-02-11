import { useMemo, useState } from "react";
import { subscriptions, baseCurrency, exchangeRates } from "../data/mock";
import { getNextBillingDate, daysUntil } from "../utils/billing";
import {
  buildCategoryTotals,
  buildTrendData,
  buildStatusTotals,
  getMonthlyCost,
} from "../utils/metrics";
import { formatCurrency, formatDate } from "../utils/format";
import SectionHeader from "../components/SectionHeader";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import DonutChart from "../components/DonutChart";
import TrendChart from "../components/TrendChart";
import CategoryBars from "../components/CategoryBars";
import RenewalList from "../components/RenewalList";
import SubscriptionTable from "../components/SubscriptionTable";
import type { SubscriptionRow } from "../components/SubscriptionTable";
const donutColors = [
  "#49d3a4",
  "#f2c94c",
  "#4da3ff",
  "#ff8c70",
  "#7ee2c1",
];

export type DashboardPageProps = {
  enriched: SubscriptionRow[];
  onOpenAddForm: () => void;
  onOpenEditForm: (row: SubscriptionRow) => void;
  onOpenDeleteConfirm: (row: SubscriptionRow) => void;
  onOpenMenu?: () => void;
};

const DashboardPage = ({
  enriched,
  onOpenAddForm,
  onOpenEditForm,
  onOpenDeleteConfirm,
  onOpenMenu,
}: DashboardPageProps) => {
  const today = new Date();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

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
  const categories = useMemo(() => {
    const set = new Set(enriched.map((item) => item.category));
    return ["all", ...Array.from(set)];
  }, [enriched]);

  const donutData = categoryTotals.slice(0, 5).map((item, index) => ({
    ...item,
    color: donutColors[index % donutColors.length],
  }));

  const trendData = buildTrendData(monthlySpend);
  const statusTotals = buildStatusTotals(subscriptions);

  const upcomingRenewals = activeSubscriptions
    .map((item) => ({
      ...item,
      daysUntil: daysUntil(item.nextBilling, today),
    }))
    .filter((item) => item.daysUntil >= 0 && item.daysUntil <= 5)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .map((item) => ({
      id: item.id,
      name: item.name,
      vendor: item.vendor,
      price: item.price,
      currency: item.currency,
      daysUntil: item.daysUntil,
      nextBilling: item.nextBilling,
    }));

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return enriched.filter((item) => {
      const matchesQuery =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [enriched, searchQuery, statusFilter, categoryFilter]);

  const itemsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubscriptions.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedSubscriptions = filteredSubscriptions.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const hasFilters =
    searchQuery.length > 0 || statusFilter !== "all" || categoryFilter !== "all";

  const ratesUpdatedAt = today;
  const isRateMissing = Object.values(exchangeRates).some((rate) => rate <= 0);
  const staleRateDays = Math.floor(
    (today.getTime() - ratesUpdatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isRateStale = staleRateDays > 7;

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Subscription Overview</h2>
          <p>
            Track renewals, manage spend, and spot upcoming charges in one
            place.
          </p>
        </div>
        <div className="topbar-actions">
          <button
            className="ghost-button mobile-only"
            onClick={onOpenMenu}
          >
            Menu
          </button>
          <button className="ghost-button">Export CSV</button>
          <button className="primary-button" onClick={onOpenAddForm}>
            Add Subscription
          </button>
        </div>
      </header>

      {isRateMissing ? (
        <div className="data-banner error">
          <strong>Exchange rate sync failed.</strong>
          <span>Totals may be inaccurate until rates are refreshed.</span>
          <button className="ghost-button">Retry</button>
        </div>
      ) : isRateStale ? (
        <div className="data-banner warning">
          <strong>Exchange rates are stale.</strong>
          <span>Last updated {staleRateDays} days ago.</span>
          <button className="ghost-button">Refresh</button>
        </div>
      ) : null}

      <section className="kpi-grid">
        <KpiCard
          label="Active subscriptions"
          value={`${activeSubscriptions.length}`}
          change={`Paused ${statusTotals.paused ?? 0}`}
          helper="Canceled hidden"
        />
        <KpiCard
          label="Monthly spend"
          value={formatCurrency(Math.round(monthlySpend), baseCurrency)}
          change="+4% vs last month"
          helper={`Avg ${formatCurrency(
            Math.round(averageSpend),
            baseCurrency
          )}`}
          highlight
        />
        <KpiCard
          label="Yearly projection"
          value={formatCurrency(Math.round(yearlySpend), baseCurrency)}
          change="Auto converted"
          helper="Multi-currency"
        />
        <KpiCard
          label="Upcoming renewals"
          value={`${upcomingRenewals.length}`}
          change="Next 5 days"
          helper="Alerts on"
        />
      </section>

      <section className="grid-two">
        <div className="stack">
          <ChartCard
            title="Monthly spend by category"
            subtitle="Converted into TWD"
          >
            <DonutChart data={donutData} totalLabel="Monthly" />
          </ChartCard>
          <ChartCard title="Category totals" subtitle="Top categories">
            <CategoryBars data={categoryTotals} />
          </ChartCard>
        </div>
        <div className="stack">
          <ChartCard
            title="Spend trend"
            subtitle="Last 6 months, normalized"
          >
            <TrendChart data={trendData} />
          </ChartCard>
          <ChartCard title="Renewal alerts" subtitle="Within 5 days">
            <RenewalList items={upcomingRenewals} />
          </ChartCard>
        </div>
      </section>

      <section className="table-section">
        <SectionHeader
          title="All subscriptions"
          subtitle={`Exchange rates: USD ${exchangeRates.USD} · EUR ${exchangeRates.EUR} · JPY ${exchangeRates.JPY}`}
          action={<button className="ghost-button">Manage list</button>}
        />
        <div className="card">
          <div className="table-toolbar">
            <div className="filter-group">
              <label>
                Search
                <input
                  className="search-input"
                  value={searchQuery}
                  placeholder="Search by service or vendor"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>
              <label>
                Status
                <select
                  className="select-input"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="canceled">Canceled</option>
                </select>
              </label>
              <label>
                Category
                <select
                  className="select-input"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All" : cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="table-actions">
              <button
                className="ghost-button"
                disabled={!hasFilters}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </button>
            </div>
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="empty-state large">
              <strong>No subscriptions found</strong>
              <p>Try adjusting filters or add a new subscription.</p>
              <div className="empty-actions">
                <button
                  className="ghost-button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Reset filters
                </button>
                <button className="primary-button" onClick={onOpenAddForm}>
                  Add subscription
                </button>
              </div>
            </div>
          ) : (
            <>
              <SubscriptionTable
                rows={pagedSubscriptions}
                onEdit={onOpenEditForm}
                onDelete={onOpenDeleteConfirm}
              />
              {totalPages > 1 ? (
                <div className="pagination">
                  <button
                    className="ghost-button"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage(safePage - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    className="ghost-button"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage(safePage + 1)}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
