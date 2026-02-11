import { formatDate, formatCurrency } from "../utils/format";
import type { CurrencyCode } from "../data/mock";

export type RenewalItem = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  currency: CurrencyCode;
  daysUntil: number;
  nextBilling: Date;
};

type RenewalListProps = {
  items: RenewalItem[];
  emptyMessage?: string;
};

const RenewalList = ({ items, emptyMessage = "No renewals in this period." }: RenewalListProps) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <strong>All clear</strong>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="renewal-list">
      {items.map((item) => (
        <div key={item.id} className="renewal-item">
          <div>
            <div className="renewal-title">{item.name}</div>
            <div className="renewal-meta">{item.vendor}</div>
          </div>
          <div className="renewal-details">
            <span className="renewal-amount">
              {formatCurrency(item.price, item.currency, 2)}
            </span>
            <span className="renewal-date">
              {item.daysUntil === 0
                ? "Today"
                : `${item.daysUntil} days · ${formatDate(item.nextBilling)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenewalList;
