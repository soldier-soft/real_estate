import React, { useEffect } from "react";
import { adConfig } from "./adConfig";
import AdPlaceholder from "./AdPlaceholder";

interface AdContainerProps {
  pagePath: string;
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  label?: string;
  dimensions?: string;
  minHeight?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Universal wrapper for AdSense ad units.
 * Guarantees layout stability (CLS prevention), page-level policy checks,
 * and safe development mode fallbacks.
 */
export const AdContainer: React.FC<AdContainerProps> = ({
  pagePath,
  slotId,
  format = "auto",
  label = "ADVERTISEMENT",
  dimensions = "Responsive Ad Unit",
  minHeight = "100px",
  className = "",
}) => {
  // Check page-level permissions
  const pageSetting = adConfig.pageSettings[pagePath] ?? { enabled: true };

  // If ads are disabled globally or on this specific page, render nothing
  if (!adConfig.adsEnabled || !pageSetting.enabled) {
    return null;
  }

  // Development mode fallback
  if (adConfig.adMode === "development") {
    return (
      <div className={`w-full mx-auto my-6 px-2 ${className}`}>
        <AdPlaceholder label={label} dimensions={dimensions} />
      </div>
    );
  }

  // Production AdSense script trigger
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense push warning:", e);
    }
  }, []);

  return (
    <div
      className={`w-full mx-auto my-6 px-2 overflow-hidden text-center select-none ${className}`}
      style={{ minHeight }}
    >
      <div className="text-[10px] uppercase font-medium tracking-wider text-gray-400 mb-1">
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={adConfig.clientId}
        data-ad-slot={slotId || adConfig.slots.inContent}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdContainer;
