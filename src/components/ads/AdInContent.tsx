import React from "react";
import AdContainer from "./AdContainer";

interface AdInContentProps {
  pagePath: string;
  className?: string;
}

export const AdInContent: React.FC<AdInContentProps> = ({ pagePath, className = "" }) => {
  return (
    <AdContainer
      pagePath={pagePath}
      format="auto"
      label="In-Content Native Ad"
      dimensions="Responsive Fluid Article Ad"
      minHeight="120px"
      className={`my-8 border-y border-slate-100 py-4 ${className}`}
    />
  );
};

export default AdInContent;
