import { formatCurrency } from "../utils/format";

export type DonutSlice = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutSlice[];
  totalLabel?: string;
};

const DonutChart = ({ data, totalLabel }: DonutChartProps) => {
  const radius = 60;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    return (
      <div className="empty-state">
        <strong>No spend data</strong>
        <p>Add subscriptions to see category insights.</p>
      </div>
    );
  }

  let offset = 0;
  const circles = data.map((item) => {
    const dash = (item.value / total) * circumference;
    const circle = (
      <circle
        key={item.label}
        r={radius}
        cx="80"
        cy="80"
        fill="transparent"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
      />
    );
    offset += dash;
    return circle;
  });

  return (
    <div className="donut-wrapper">
      <svg viewBox="0 0 160 160" className="donut-chart">
        <circle
          r={radius}
          cx="80"
          cy="80"
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {circles}
      </svg>
      <div className="donut-center">
        <div className="donut-value" data-mono>
          {formatCurrency(total, "TWD")}
        </div>
        <div className="donut-label">{totalLabel ?? "Monthly"}</div>
      </div>
      <div className="donut-legend">
        {data.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-label">
              <span className="legend-dot" style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
            <strong>{Math.round((item.value / total) * 100)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
