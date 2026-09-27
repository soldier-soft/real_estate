import React from "react";
import AdContainer from "./AdContainer";

interface AdBannerProps {
  pagePath: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ pagePath, className = "" }) => {
  return (
    <AdContainer
      pagePath={pagePath}
      format="horizontal"
      label="Header / Top Banner"
      dimensions="728x90 Leaderboard / 320x50 Mobile Banner"
      minHeight="90px"
      className={className}
    />
  );
};

export default AdBanner;
