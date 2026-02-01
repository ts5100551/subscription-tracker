import type { ChartPoint } from "../utils/metrics";
import { formatCurrency } from "../utils/format";

type TrendChartProps = {
  data: ChartPoint[];
};

const TrendChart = ({ data }: TrendChartProps) => {
  if (data.length === 0 || data.every((point) => point.value === 0)) {
    return (
      <div className="empty-state">
        <strong>No trend data</strong>
        <p>Connect subscriptions to visualize monthly spend.</p>
      </div>
    );
  }

  const max = Math.max(...data.map((point) => point.value));
  const min = Math.min(...data.map((point) => point.value));
  const padding = 24;
  const width = 360;
  const height = 140;

  const points = data.map((point, index) => {
    const x = (width / (data.length - 1)) * index;
    const y = height - ((point.value - min) / (max - min || 1)) * height;
    return `${x + padding},${y + padding}`;
  });

  const path = `M ${points.join(" L ")}`;

  return (
    <div className="trend-chart">
      <svg
        viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
        aria-hidden
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#49d3a4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#49d3a4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L ${width + padding},${height + padding} L ${padding},${height + padding} Z`}
          fill="url(#trend-fill)"
        />
        <path d={path} fill="none" stroke="#49d3a4" strokeWidth="3" />
        {points.map((point) => {
          const [x, y] = point.split(",").map(Number);
          return (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={4}
              fill="#0f141b"
              stroke="#49d3a4"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="trend-labels">
        {data.map((point) => (
          <div key={point.label}>
            <span>{point.label}</span>
            <strong>{formatCurrency(point.value, "TWD")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
