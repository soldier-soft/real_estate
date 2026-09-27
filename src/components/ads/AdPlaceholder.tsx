import React from "react";

interface AdPlaceholderProps {
  label?: string;
  dimensions?: string;
  className?: string;
}

/**
 * Visually distinct development placeholder component for advertisements.
 * Renders only during development mode or when testing layout positioning.
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  label = "ADVERTISEMENT",
  dimensions = "Responsive Ad Slot",
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 my-6 bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 select-none transition-all ${className}`}
      style={{ minHeight: "100px" }}
      aria-label="Advertisement Development Placeholder"
    >
      <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
        {label} &bull; Development Placeholder
      </div>
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {dimensions}
      </div>
      <div className="text-[10px] text-slate-400 mt-1">
        Ads disabled on localhost / development mode
      </div>
    </div>
  );
};

export default AdPlaceholder;
