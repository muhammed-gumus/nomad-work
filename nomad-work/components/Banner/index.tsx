import React from "react";
import Link from "next/link";

const titleText1 = "Nomad"; // Kullanmak istediğiniz özel metin
const titleText2 = "Work";
const descText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation "; // Kullanmak istediğiniz özel metin

const customImageUrl = "images/banner.jpg"; // Kullanmak istediğiniz özel görsel URL

const Banner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 px-6 md:flex-row md:justify-around md:px-20">
      {/* Metin ve Butonlar */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2">
        <div className="mb-6">
          <p className="text-6xl font-bold">{titleText1}</p>
          <p className="text-8xl font-extrabold tracking-wider">{titleText2}</p>
        </div>

        <p className="text-xl opacity-70 mb-6 md:pr-16">{descText}</p>

        <Link href={"/discover/"}>
          <button className="text-white px-10 py-3 rounded-lg text-xl bg-black transition duration-300 hover:text-yellow-500 hover:bg-white mb-6 md:mb-0">
            Discover
          </button>
        </Link>
      </div>

      {/* Özel Görsel (Tablet ve Büyük Ekranlarda) */}
      <div className="hidden md:block flex items-center justify-center md:w-1/3">
        <img
          src={customImageUrl}
          alt="Banner"
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
