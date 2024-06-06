"use client";

import React, { useState, useEffect } from "react";
import Cafe from "../Places/Cafe/page";
import Library from "../Places/Library/page";
import Restaurant from "../Places/Restaurant/page";
import AuthModal from "@/components/AuthModal";
import AuthRequiredModal from "@/components/AuthRequiredModal.tsx";

const Page: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Cafe");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [sortByNomadRating, setSortByNomadRating] = useState(false); // Yeni state

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");

    if (jwtToken && username) {
      setIsAuthenticated(true);
      setIsAuthModalOpen(true);
    } else {
      setIsAuthRequiredModalOpen(true);
    }
  }, []);

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthRequiredModalClose = () => {
    setIsAuthRequiredModalOpen(false);
  };

  const handleSortByRating = () => {
    setSortByRating(!sortByRating);
  };

  const handleShowOnlyOpen = () => {
    setShowOnlyOpen(!showOnlyOpen);
  };

  const handleSortByNomadRating = () => {
    setSortByNomadRating(!sortByNomadRating); // Yeni fonksiyon
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

        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortByRating}
              onChange={handleSortByRating}
              className="rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>Google Değerlendirmelerine Göre Sırala</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyOpen}
              onChange={handleShowOnlyOpen}
              className="rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>Sadece Açık Mekanlar</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortByNomadRating}
              onChange={handleSortByNomadRating} // Yeni checkbox
              className="rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>Nomad Değerlendirmelerine Göre Sırala</span>
          </label>
        </div>

        {selectedCategory === "Cafe" && (
          <Cafe sortByRating={sortByRating} showOnlyOpen={showOnlyOpen} sortByNomadRating={sortByNomadRating} /> // Yeni prop eklendi
        )}
        {selectedCategory === "Restaurant" && <Restaurant />}
        {selectedCategory === "Library" && <Library />}
      </div>
    </div>
  );
};

export default Page;
