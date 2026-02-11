import "./styles.css";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { subscriptions, baseCurrency } from "./data/mock";
import { getNextBillingDate } from "./utils/billing";
import { formatDate } from "./utils/format";
import SubscriptionFormModal from "./components/subscription-form-modal";
import DeleteConfirmModal from "./components/delete-confirm-modal";
import DashboardPage from "./pages/dashboard-page";
import SubscriptionsPage from "./pages/subscriptions-page";
import AnalyticsPage from "./pages/analytics-page";
import AlertsPage from "./pages/alerts-page";
import SettingsPage from "./pages/settings-page";
import type { SubscriptionFormValues } from "./components/subscription-form-modal";
import type { SubscriptionRow } from "./components/SubscriptionTable";

const App = () => {
  const today = new Date();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formInitialValues, setFormInitialValues] =
    useState<SubscriptionFormValues | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const enriched = useMemo(
    () =>
      subscriptions.map((item) => ({
        ...item,
        nextBilling: getNextBillingDate(item.startDate, item.cycle, today),
      })),
    []
  );

  const categories = useMemo(() => {
    const set = new Set(enriched.map((item) => item.category));
    return ["all", ...Array.from(set)];
  }, [enriched]);

  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
  }, [isNavOpen]);

  const openAddForm = () => {
    setFormMode("add");
    setFormInitialValues(null);
    setFormModalOpen(true);
  };

  const openEditForm = (row: SubscriptionRow) => {
    setFormMode("edit");
    setFormInitialValues({
      id: row.id,
      name: row.name,
      vendor: row.vendor,
      category: row.category,
      price: row.price,
      currency: row.currency,
      cycle: row.cycle,
      startDate: row.startDate,
      status: row.status,
      note: row.note,
    });
    setFormModalOpen(true);
  };

  const openDeleteConfirm = (row: SubscriptionRow) => {
    setDeleteTargetName(row.name);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = (_values: SubscriptionFormValues) => {
    setFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
  };

  const basePageProps = {
    onOpenMenu: () => setIsNavOpen(true),
  };

  const pagePropsWithEnriched = {
    ...basePageProps,
    enriched,
    onOpenAddForm: openAddForm,
    onOpenEditForm: openEditForm,
    onOpenDeleteConfirm: openDeleteConfirm,
  };

  return (
    <BrowserRouter>
      <div className={`app-shell${isNavOpen ? " nav-open" : ""}`}>
        <aside className="sidebar">
          <div className="sidebar-head">
            <div className="brand">
              <span className="brand-dot" />
              <div className="brand-text">
                <h1>SubTrack</h1>
                <p>Personal subscriptions</p>
              </div>
            </div>
            <button
              className="ghost-button mobile-only"
              onClick={() => setIsNavOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              onClick={() => setIsNavOpen(false)}
              aria-label="Dashboard"
              title="Dashboard"
            >
              <span className="nav-icon">DB</span>
              <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              onClick={() => setIsNavOpen(false)}
              aria-label="Subscriptions"
              title="Subscriptions"
            >
              <span className="nav-icon">SB</span>
              <span className="nav-label">Subscriptions</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              onClick={() => setIsNavOpen(false)}
              aria-label="Analytics"
              title="Analytics"
            >
              <span className="nav-icon">AN</span>
              <span className="nav-label">Analytics</span>
            </NavLink>
            <NavLink
              to="/alerts"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              onClick={() => setIsNavOpen(false)}
              aria-label="Alerts"
              title="Alerts"
            >
              <span className="nav-icon">AL</span>
              <span className="nav-label">Alerts</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              onClick={() => setIsNavOpen(false)}
              aria-label="Settings"
              title="Settings"
            >
              <span className="nav-icon">ST</span>
              <span className="nav-label">Settings</span>
            </NavLink>
          </nav>
          <span className="nav-hint">Swipe to see more</span>
          <div className="sidebar-card">
            <p>Base currency</p>
            <strong>{baseCurrency}</strong>
            <span>Rates updated: {formatDate(today)}</span>
          </div>
        </aside>
        <div
          className="backdrop"
          onClick={() => setIsNavOpen(false)}
          aria-hidden
        />

        <main className="main">
          <Routes>
            <Route path="/" element={<DashboardPage {...pagePropsWithEnriched} />} />
            <Route
              path="/subscriptions"
              element={<SubscriptionsPage {...pagePropsWithEnriched} />}
            />
            <Route
              path="/analytics"
              element={<AnalyticsPage {...pagePropsWithEnriched} />}
            />
            <Route
              path="/alerts"
              element={<AlertsPage {...pagePropsWithEnriched} />}
            />
            <Route
              path="/settings"
              element={<SettingsPage {...basePageProps} />}
            />
          </Routes>
        </main>

        <SubscriptionFormModal
          isOpen={formModalOpen}
          mode={formMode}
          initialValues={formInitialValues}
          categories={categories.filter((c) => c !== "all")}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleFormSubmit}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          subscriptionName={deleteTargetName}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
