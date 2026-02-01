import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="chart-body">{children}</div>
    </div>
  );
};

export default ChartCard;
