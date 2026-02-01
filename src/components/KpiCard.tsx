type KpiCardProps = {
  label: string;
  value: string;
  change?: string;
  helper?: string;
  highlight?: boolean;
};

const KpiCard = ({ label, value, change, helper, highlight }: KpiCardProps) => {
  return (
    <div className={`card kpi-card${highlight ? " highlight" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" data-mono>
        {value}
      </div>
      <div className="kpi-meta">
        {change ? <span className="kpi-change">{change}</span> : null}
        {helper ? <span className="kpi-helper">{helper}</span> : null}
      </div>
    </div>
  );
};

export default KpiCard;
