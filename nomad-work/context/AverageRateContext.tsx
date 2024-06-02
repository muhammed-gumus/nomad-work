"use client";
// context/AverageRateContext.tsx
import React, { createContext, useContext, useState } from "react";

interface AverageRateContextType {
  averageRates: Record<string, number | null>;
  setAverageRates: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
}

const AverageRateContext = createContext<AverageRateContextType | undefined>(undefined);

export const AverageRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [averageRates, setAverageRates] = useState<Record<string, number | null>>({});

  return (
    <AverageRateContext.Provider value={{ averageRates, setAverageRates }}>
      {children}
    </AverageRateContext.Provider>
  );
};

export const useAverageRate = () => {
  const context = useContext(AverageRateContext);
  if (!context) {
    throw new Error("useAverageRate must be used within an AverageRateProvider");
  }
  return context;
};
