"use client";
import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import AuthRequiredModal from "@/components/AuthRequiredModal.tsx";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState(false);

  useEffect(() => {
    // localStorage'dan jwtToken ve username kontrolü yap
    const jwtToken = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");

    if (jwtToken && username) {
      setIsAuthenticated(true);
      setIsAuthModalOpen(true);
    } else {
      setIsAuthRequiredModalOpen(true);
    }
  }, []); // Boş dependency array, useEffect'in sadece bir kez çalışmasını sağlar

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthRequiredModalClose = () => {
    setIsAuthRequiredModalOpen(false);
  };

  return (
    <main className="flex flex-col items-center justify-between py-4">
      <Banner />
      {isAuthenticated && (
        <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
      )}
      {!isAuthenticated && (
        <AuthRequiredModal
          isOpen={isAuthRequiredModalOpen}
          onClose={handleAuthRequiredModalClose}
        />
      )}
    </main>
  );
}
