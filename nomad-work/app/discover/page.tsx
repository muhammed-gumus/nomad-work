"use client";
import React, { useState } from "react";
import Navbar from "../Navbar/page";
import Cafe from "../Cafe/page";
import Library from "../Library/page";
import Restaurant from "../Restaurant/page";

const Page: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Cafe");

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />
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
            Cafe
          </button>
          <button
            className={`${
              selectedCategory === "Restaurant"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Restaurant")}
          >
            Restaurant
          </button>
          <button
            className={`${
              selectedCategory === "Library"
                ? "text-xl"
                : "text-base opacity-50 hover:opacity-75"
            } transition-all duration-300 ease-in-out`}
            onClick={() => setSelectedCategory("Library")}
          >
            Library
          </button>
        </div>

        {selectedCategory === "Cafe" && <Cafe />}
        {selectedCategory === "Restaurant" && <Restaurant />}
        {selectedCategory === "Library" && <Library />}
      </div>
    </div>
  );
};

export default Page;
