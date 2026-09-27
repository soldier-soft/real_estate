import React from "react";
import AdContainer from "./AdContainer";

interface AdRectangleProps {
  pagePath: string;
  className?: string;
}

export const AdRectangle: React.FC<AdRectangleProps> = ({ pagePath, className = "" }) => {
  return (
    <AdContainer
      pagePath={pagePath}
      format="rectangle"
      label="Medium Rectangle"
      dimensions="300x250 Medium Rectangle"
      minHeight="250px"
      className={className}
    />
  );
};

export default AdRectangle;
