import { baseCurrency, exchangeRates } from "../data/mock";
import { formatDate } from "../utils/format";

export type SettingsPageProps = {
  onOpenMenu?: () => void;
};

const SettingsPage = ({ onOpenMenu }: SettingsPageProps) => {
  const today = new Date();

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Settings</h2>
          <p>Configure your preferences and manage your data.</p>
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

      <section className="settings-section">
        <div className="settings-group">
          <h3 className="settings-group-title">Currency & rates</h3>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <strong>Base currency</strong>
                <p className="settings-helper">All totals are converted to this currency.</p>
              </div>
              <span className="settings-value" data-mono>{baseCurrency}</span>
            </div>
            <div className="settings-row">
              <div>
                <strong>Exchange rates</strong>
                <p className="settings-helper">
                  USD {exchangeRates.USD} · EUR {exchangeRates.EUR} · JPY {exchangeRates.JPY}
                </p>
              </div>
              <span className="settings-value settings-muted">
                Updated {formatDate(today)}
              </span>
            </div>
            <button className="ghost-button settings-action" disabled>
              Refresh rates (coming soon)
            </button>
          </div>
        </div>

        <div className="settings-group">
          <h3 className="settings-group-title">Data export</h3>
          <div className="settings-card">
            <p className="settings-desc">
              Export your subscriptions as CSV or JSON for backup or use in other tools.
            </p>
            <div className="settings-actions-row">
              <button className="ghost-button" disabled>
                Export CSV (coming soon)
              </button>
              <button className="ghost-button" disabled>
                Export JSON (coming soon)
              </button>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3 className="settings-group-title">Appearance</h3>
          <div className="settings-card">
            <div className="settings-row">
              <div>
                <strong>Theme</strong>
                <p className="settings-helper">Dark mode (default). Light mode coming in a future update.</p>
              </div>
              <span className="settings-value settings-muted">Dark</span>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3 className="settings-group-title">Account</h3>
          <div className="settings-card">
            <p className="settings-desc">
              Sign in and manage your account. Data is stored locally until you connect.
            </p>
            <button className="primary-button" disabled>
              Sign in (coming soon)
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SettingsPage;
