import React from "react";
import { Check } from "lucide-react";

export const BookingProgress = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Show" },
    { number: 2, label: "Seats" },
    { number: 3, label: "Food" },
    { number: 4, label: "Delivery" },
    { number: 5, label: "Pay" }
  ];

  return (
    <div className="w-full py-2 sm:py-3.5 border-b border-[#292929] bg-[#0c0c0c]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 flex items-center justify-between">
        {steps.map((step, idx) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step item */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? "bg-[#FFC914] text-black ring-2 sm:ring-4 ring-[#FFC914]/20 font-black"
                      : isDone
                      ? "bg-[#22C55E] text-white"
                      : "bg-[#1f1f1f] text-[#666] border border-[#333]"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : step.number}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-semibold ${
                    isCurrent
                      ? "text-white"
                      : isDone
                      ? "text-[#22C55E]"
                      : "text-[#666]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 sm:mx-4 transition-colors ${
                    step.number < currentStep ? "bg-[#22C55E]" : "bg-[#222]"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

