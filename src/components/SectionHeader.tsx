import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
};

export default SectionHeader;
