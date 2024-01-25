"use client";
import React, { useState } from "react";
import Cafe from "../Places/Cafe/page";
import Library from "../Places/Library/page";
import Restaurant from "../Places/Restaurant/page";
import Bakery from "../Places/Bakery/page";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import AuthRequiredModal from "@/components/AuthRequiredModal.tsx";

const Page: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Cafe");
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
    <div className="flex flex-col items-center justify-between py-4">
      {isAuthenticated && (
        <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
      )}
      {!isAuthenticated && (
        <AuthRequiredModal
          isOpen={isAuthRequiredModalOpen}
          onClose={handleAuthRequiredModalClose}
        />
      )}
      <div className="flex w-full justify-center flex-col items-center my-16 gap-4">
        <div className="flex gap-4">
          <button
            className={`${
              selectedCategory === "Cafe"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Cafe")}
          >
            Kafe
          </button>
          <button
            className={`${
              selectedCategory === "Restaurant"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Restaurant")}
          >
            Restoran
          </button>
          {/* <button
            className={`${
              selectedCategory === "Bakery"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Bakery")}
          >
            Bakery
          </button> */}
          <button
            className={`${
              selectedCategory === "Library"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Library")}
          >
            Kütüphane
          </button>
        </div>

        {selectedCategory === "Cafe" && <Cafe />}
        {selectedCategory === "Restaurant" && <Restaurant />}
        {/* {selectedCategory === "Restaurant" && <Bakery />} */}
        {selectedCategory === "Library" && <Library />}
      </div>
    </div>
  );
};

export default Page;
