"use client";
import React from "react";
import Navbar from "../Navbar/page";
import Link from "next/link";
import Map from "../Maps/page"

const descText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."; // Kullanmak istediğiniz özel metin

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />

      <div className="flex flex-col md:flex-row items-center justify-center my-12 mx-4 md:mx-12">
        <div className="md:w-1/2 md:mr-6 md:flex flex flex-col gap-2 items-start">
          <p className="text-5xl font-bold mb-4">ABOUT US</p>
          <p className="mb-4">{descText}</p>
          <Link href="#our-team">
            <button className="flex flex-row gap-3 items-center justify-center text-white px-6 py-3 rounded-lg text-xl bg-black transition duration-300 hover:text-yellow-500 hover:bg-white mb-6 md:mb-0">
              OUR TEAM
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.75735 5.63605L6.34314 7.05026L12 12.7071L17.6569 7.05029L16.2427 5.63608L12 9.87872L7.75735 5.63605Z"
                  fill="currentColor"
                />
                <path
                  d="M6.34314 12.7071L7.75735 11.2929L12 15.5356L16.2427 11.2929L17.6569 12.7071L12 18.364L6.34314 12.7071Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </Link>
        </div>
        <Map/>
      </div>

      <div id="our-team" className="m-10">
        {/* İçerik ekleyin */}
      </div>
    </div>
  );
};

export default Page;
