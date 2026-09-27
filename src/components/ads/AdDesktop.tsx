import React from "react";

interface ResponsiveAdProps {
  children: React.ReactNode;
}

export const AdDesktop: React.FC<ResponsiveAdProps> = ({ children }) => {
  return <div className="hidden md:block w-full">{children}</div>;
};

export const AdMobile: React.FC<ResponsiveAdProps> = ({ children }) => {
  return <div className="block md:hidden w-full">{children}</div>;
};
