import type { ChartPoint } from "../utils/metrics";
import { formatCurrency } from "../utils/format";

type TrendChartProps = {
  data: ChartPoint[];
};

const Y_TICKS = 4;

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
  const range = max - min || 1;

  const leftPadding = 56;
  const rightPadding = 16;
  const topPadding = 16;
  const bottomPadding = 16;
  const chartWidth = 320;
  const chartHeight = 120;

  const svgWidth = leftPadding + chartWidth + rightPadding;
  const svgHeight = topPadding + chartHeight + bottomPadding;

  const points = data.map((point, index) => {
    const x = leftPadding + (chartWidth / (data.length - 1)) * index;
    const y = topPadding + chartHeight - ((point.value - min) / range) * chartHeight;
    return { x, y, ...point };
  });

  const pathD = points.length > 0
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
    : "";
  const areaD = pathD
    ? `${pathD} L ${leftPadding + chartWidth},${topPadding + chartHeight} L ${leftPadding},${topPadding + chartHeight} Z`
    : "";

  const yTicks = Array.from({ length: Y_TICKS }, (_, i) => {
    const value = min + (range * i) / (Y_TICKS - 1);
    const y = topPadding + chartHeight - (i / (Y_TICKS - 1)) * chartHeight;
    return { value, y };
  });

  return (
    <div className="trend-chart">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="trend-chart-svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#49d3a4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#49d3a4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={leftPadding}
            y1={tick.y}
            x2={leftPadding + chartWidth}
            y2={tick.y}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={leftPadding - 10}
            y={tick.y + 4}
            textAnchor="end"
            className="trend-axis-label"
            fontSize="10"
            fill="currentColor"
          >
            {formatCurrency(Math.round(tick.value), "TWD", 0)}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#trend-fill)" />
        <path d={pathD} fill="none" stroke="#49d3a4" strokeWidth="2.5" />
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#0f141b"
            stroke="#49d3a4"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="trend-labels">
        {data.map((point) => (
          <div key={point.label} className="trend-label-item">
            <span className="trend-label-month">{point.label}</span>
            <span className="trend-label-value" data-mono>
              {formatCurrency(point.value, "TWD")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
