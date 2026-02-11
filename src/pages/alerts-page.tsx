import { useMemo, useState } from "react";
import { daysUntil } from "../utils/billing";
import RenewalList from "../components/RenewalList";
import type { RenewalItem } from "../components/RenewalList";
import type { SubscriptionRow } from "../components/SubscriptionTable";

const DAYS_OPTIONS = [
  { value: 5, label: "5 days" },
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
] as const;

export type AlertsPageProps = {
  enriched: SubscriptionRow[];
  onOpenMenu?: () => void;
};

const AlertsPage = ({ enriched, onOpenMenu }: AlertsPageProps) => {
  const today = new Date();
  const [daysAhead, setDaysAhead] = useState(5);

  const upcomingRenewals = useMemo(() => {
    const active = enriched.filter((item) => item.status === "active");
    return active
      .map((item) => ({
        ...item,
        daysUntil: daysUntil(item.nextBilling, today),
      }))
      .filter((item) => item.daysUntil >= 0 && item.daysUntil <= daysAhead)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .map((item): RenewalItem => ({
        id: item.id,
        name: item.name,
        vendor: item.vendor,
        price: item.price,
        currency: item.currency,
        daysUntil: item.daysUntil,
        nextBilling: item.nextBilling,
      }));
  }, [enriched, daysAhead]);

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Renewal Alerts</h2>
          <p>
            Upcoming charges in the next few days. Stay ahead of billing
            cycles.
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

      <section className="alerts-section">
        <div className="alerts-toolbar">
          <span className="alerts-toolbar-label">Show renewals within</span>
          <div className="alerts-days-options">
            {DAYS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`ghost-button alerts-days-btn${daysAhead === value ? " active" : ""}`}
                onClick={() => setDaysAhead(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chart-card">
            <h3 className="alerts-list-title">Upcoming renewals</h3>
            <p className="alerts-list-subtitle">
              {upcomingRenewals.length} subscription
              {upcomingRenewals.length !== 1 ? "s" : ""} due in the next{" "}
              {daysAhead} days
            </p>
            <div className="chart-body">
              <RenewalList
                items={upcomingRenewals}
                emptyMessage={`No renewals in the next ${daysAhead} days.`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AlertsPage;
