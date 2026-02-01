import type { ChartPoint } from "../utils/metrics";
import { formatCurrency } from "../utils/format";

type CategoryBarsProps = {
  data: ChartPoint[];
};

const CategoryBars = ({ data }: CategoryBarsProps) => {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <strong>No categories yet</strong>
        <p>Add subscriptions to see category breakdown.</p>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="category-bars">
      {data.map((item) => (
        <div key={item.label} className="category-row">
          <div className="category-label">{item.label}</div>
          <div className="category-bar">
            <span style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <div className="category-value" data-mono>
            {formatCurrency(Math.round(item.value), "TWD")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBars;
