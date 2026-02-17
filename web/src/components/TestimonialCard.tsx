import { forwardRef } from "react";

type TestimonialCardProps = {
  initial: string; // first letter for the avatar
  name: string;
  role: string;
  quote: string;
  visible: boolean;
  delay: string;
};

const TestimonialCard = forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ initial, name, role, quote, visible, delay }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg bounce-card-initial ${
          visible ? "bounce-card" : ""
        }`}
        style={{ animationDelay: delay }}
      >
        <div className="flex items-center gap-[12px] mb-[15px]">
          <div className="w-[50px] h-[50px] bg-[var(--secondary)] rounded-full flex items-center justify-center fred-bold text-[20px] text-[var(--primary)]">
            {initial}
          </div>
          <div>
            <h4 className="fred-bold text-[18px] text-[var(--primary)]">
              {name}
            </h4>
            <p className="fred-light text-[14px] text-gray-500">{role}</p>
          </div>
        </div>
        <p className="fred-light text-[16px] text-gray-700 italic">
          "{quote}"
        </p>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";
export default TestimonialCard;
