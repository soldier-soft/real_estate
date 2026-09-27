import React from "react";
import AdContainer from "./AdContainer";

interface AdSidebarProps {
  pagePath: string;
  className?: string;
}

export const AdSidebar: React.FC<AdSidebarProps> = ({ pagePath, className = "" }) => {
  return (
    <AdContainer
      pagePath={pagePath}
      format="vertical"
      label="Desktop Sidebar"
      dimensions="300x600 Half Page / 160x600 Skyscraper"
      minHeight="300px"
      className={className}
    />
  );
};

export default AdSidebar;
