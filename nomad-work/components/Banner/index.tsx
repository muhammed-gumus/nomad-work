import React from "react";
import Link from "next/link";

const titleText1 = "Nomad";
const titleText2 = "Work";
const descText =
  "Nomad Work ile en iyi çalışma mekanlarını keşfedin, değerlendirin ve yapay zeka destekli puanlamalarla seçiminizi yapın. Çalışma tarzınızı özgürleştirin!"; // Kullanmak istediğiniz özel metin

const customImageUrl = "images/banner.jpg";

const Banner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 px-6 md:flex-row md:justify-around md:px-20">
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2">
        <div className="mb-6">
          <p className="text-6xl font-bold">{titleText1}</p>
          <p className="text-8xl font-extrabold tracking-wider">{titleText2}</p>
        </div>

        <p className="text-xl opacity-70 mb-6 md:pr-16">{descText}</p>

        <Link href={"/Discover/"}>
          <button className="text-white px-10 py-3 rounded-lg text-xl bg-black transition duration-300 hover:text-yellow-500 hover:bg-white mb-6 md:mb-0">
            Keşfet
          </button>
        </Link>
      </div>

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
