"use client";
import React, { useState } from "react";
import Navbar from "../Navbar/page";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />
    </div>
  );
};

export default Page;
