import { forwardRef } from "react";
import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  visible: boolean;
  delay: string; // e.g. "0s", "0.1s", "0.2s"
};

// forwardRef so the parent can attach an IntersectionObserver ref to this card
const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, visible, delay }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300 bounce-card-initial ${
          visible ? "bounce-card" : ""
        }`}
        style={{ animationDelay: delay }}
      >
        <div className="w-[48px] h-[48px] mb-[15px]">{icon}</div>
        <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
          {title}
        </h3>
        <p className="fred-light text-[16px] text-gray-600">{description}</p>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;
