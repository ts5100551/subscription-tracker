import { useState, useEffect } from "react";
import type { Subscription, BillingCycle, CurrencyCode, SubscriptionStatus } from "../data/mock";

const CURRENCIES: CurrencyCode[] = ["TWD", "USD", "EUR", "JPY"];
const CYCLES: BillingCycle[] = ["monthly", "yearly"];
const STATUSES: SubscriptionStatus[] = ["active", "paused", "canceled"];

const DEFAULT_CATEGORIES = [
  "Productivity",
  "Entertainment",
  "Design",
  "AI Tools",
  "Gaming",
  "Knowledge",
  "Developer Tools",
  "Cloud",
  "Education",
  "Security",
  "Other",
];

export type SubscriptionFormValues = Omit<Subscription, "id"> & { id?: string };

type SubscriptionFormModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  initialValues?: SubscriptionFormValues | null;
  categories?: string[];
  onClose: () => void;
  onSubmit?: (values: SubscriptionFormValues) => void;
};

const defaultFormValues: SubscriptionFormValues = {
  name: "",
  vendor: "",
  category: "Productivity",
  price: 0,
  currency: "TWD",
  cycle: "monthly",
  startDate: new Date().toISOString().slice(0, 10),
  status: "active",
  note: "",
};

const SubscriptionFormModal = ({
  isOpen,
  mode,
  initialValues,
  categories = DEFAULT_CATEGORIES,
  onClose,
  onSubmit,
}: SubscriptionFormModalProps) => {
  const [formValues, setFormValues] = useState<SubscriptionFormValues>(defaultFormValues);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setFormValues({
        ...initialValues,
        startDate: initialValues.startDate
          ? new Date(initialValues.startDate).toISOString().slice(0, 10)
          : defaultFormValues.startDate,
      });
    } else {
      setFormValues({
        ...defaultFormValues,
        startDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [isOpen, mode, initialValues]);

  const handleChange = (
    field: keyof SubscriptionFormValues,
    value: string | number | undefined
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formValues);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const title = mode === "add" ? "Add subscription" : "Edit subscription";

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card modal-form">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-row form-row-split">
            <label>
              <span>Service name</span>
              <input
                type="text"
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Notion Plus"
                required
                autoFocus
              />
            </label>
            <label>
              <span>Vendor</span>
              <input
                type="text"
                value={formValues.vendor}
                onChange={(e) => handleChange("vendor", e.target.value)}
                placeholder="e.g. Notion"
              />
            </label>
          </div>

          <div className="form-row form-row-split">
            <label>
              <span>Category</span>
              <select
                value={formValues.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select
                value={formValues.status}
                onChange={(e) => handleChange("status", e.target.value as SubscriptionStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row form-row-split">
            <label>
              <span>Price</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={formValues.price || ""}
                onChange={(e) =>
                  handleChange("price", e.target.value === "" ? 0 : parseFloat(e.target.value))
                }
                placeholder="0"
                required
              />
            </label>
            <label>
              <span>Currency</span>
              <select
                value={formValues.currency}
                onChange={(e) => handleChange("currency", e.target.value as CurrencyCode)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row form-row-split">
            <label>
              <span>Billing cycle</span>
              <select
                value={formValues.cycle}
                onChange={(e) => handleChange("cycle", e.target.value as BillingCycle)}
              >
                {CYCLES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Start / first billing date</span>
              <input
                type="date"
                value={formValues.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Note (optional)</span>
              <textarea
                value={formValues.note ?? ""}
                onChange={(e) => handleChange("note", e.target.value || undefined)}
                placeholder="e.g. Company plan, promo code"
                rows={2}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {mode === "add" ? "Add" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;
