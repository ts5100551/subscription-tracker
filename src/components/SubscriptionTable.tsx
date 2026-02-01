import type { Subscription } from "../data/mock";
import { formatCurrency, formatDate, formatCycle } from "../utils/format";

export type SubscriptionRow = Subscription & {
  nextBilling: Date;
};

type SubscriptionTableProps = {
  rows: SubscriptionRow[];
};

const statusClass = (status: Subscription["status"]) => {
  switch (status) {
    case "active":
      return "status-active";
    case "paused":
      return "status-paused";
    case "canceled":
      return "status-canceled";
    default:
      return "status-neutral";
  }
};

const SubscriptionTable = ({ rows }: SubscriptionTableProps) => {
  return (
    <div className="table-wrapper">
      <table className="subscription-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Category</th>
            <th>Cycle</th>
            <th>Next Billing</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Service">
                <div className="service-cell">
                  <strong>{row.name}</strong>
                  <span>{row.vendor}</span>
                </div>
              </td>
              <td data-label="Category">{row.category}</td>
              <td data-label="Cycle">{formatCycle(row.cycle)}</td>
              <td data-label="Next Billing">{formatDate(row.nextBilling)}</td>
              <td data-label="Price">
                {formatCurrency(row.price, row.currency, 2)}
              </td>
              <td data-label="Status">
                <span className={`status-pill ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;
