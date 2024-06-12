// components/ClientOnly.tsx
"use client";

import { useState } from "react";
import SessionManager from "@/components/SessionManager/page";
import Navbar from "@/components/Navbar";

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [isUserLoggedOut, setIsUserLoggedOut] = useState(false);

  const handleLogout = () => {
    setIsUserLoggedOut(true);
  };

  return (
    <>
      <SessionManager onLogout={handleLogout} />
      <Navbar isUserLoggedOut={isUserLoggedOut} />
      {children}
    </>
  );
};

export default ClientOnly;
