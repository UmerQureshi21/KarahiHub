import { forwardRef } from "react";

type StatCardProps = {
  count: number;
  label: string;
  color: string; // e.g. "var(--primary)" or "var(--secondary)"
  visible: boolean;
  delay: string;
};

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ count, label, color, visible, delay }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg text-center hover:shadow-xl transition-shadow duration-300 bounce-card-initial ${
          visible ? "bounce-card" : ""
        }`}
        style={{ animationDelay: delay }}
      >
        <div
          className="fred-bold text-[40px] md:text-[48px] mb-[8px]"
          style={{ color }}
        >
          {count}+
        </div>
        <p className="fred-medium text-[16px] md:text-[18px] text-gray-600">
          {label}
        </p>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
export default StatCard;
