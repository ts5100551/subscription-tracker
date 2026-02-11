import { useMemo, useState, useEffect } from "react";
import { baseCurrency, exchangeRates } from "../data/mock";
import { getMonthlyCost } from "../utils/metrics";
import { formatCurrency } from "../utils/format";
import SectionHeader from "../components/SectionHeader";
import SubscriptionTable from "../components/SubscriptionTable";
import type { SubscriptionRow } from "../components/SubscriptionTable";

const ITEMS_PER_PAGE = 10;

export type SubscriptionsPageProps = {
  enriched: SubscriptionRow[];
  onOpenAddForm: () => void;
  onOpenEditForm: (row: SubscriptionRow) => void;
  onOpenDeleteConfirm: (row: SubscriptionRow) => void;
  onOpenMenu?: () => void;
};

const SubscriptionsPage = ({
  enriched,
  onOpenAddForm,
  onOpenEditForm,
  onOpenDeleteConfirm,
  onOpenMenu,
}: SubscriptionsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(enriched.map((item) => item.category));
    return ["all", ...Array.from(set)];
  }, [enriched]);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedSubscriptions = filteredSubscriptions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasFilters =
    searchQuery.length > 0 || statusFilter !== "all" || categoryFilter !== "all";

  const totalMonthlySpend = filteredSubscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + getMonthlyCost(s), 0);

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Subscriptions</h2>
          <p>
            Manage all your subscriptions. Add, edit, or remove items to keep
            your list accurate.
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

      <section className="subscriptions-summary">
        <div className="summary-card">
          <span className="summary-label">Filtered total</span>
          <strong className="summary-value" data-mono>
            {formatCurrency(Math.round(totalMonthlySpend), baseCurrency)}
          </strong>
          <span className="summary-helper">per month (active only)</span>
        </div>
      </section>

      <section className="table-section">
        <SectionHeader
          title="All subscriptions"
          subtitle={`${filteredSubscriptions.length} items · Exchange rates: USD ${exchangeRates.USD} · EUR ${exchangeRates.EUR} · JPY ${exchangeRates.JPY}`}
          action={null}
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

export default SubscriptionsPage;
