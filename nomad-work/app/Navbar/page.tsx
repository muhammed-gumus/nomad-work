"use client";
import { useState } from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-8 px-24 flex justify-between items-center w-full">
      {/* Logo */}
      <div className="text-white text-2xl font-bold hidden md:block">
        <Link href="/">
          <span className="cursor-pointer">Logo</span>
        </Link>
      </div>

      {/* Burger Menü (Tablet ve Mobil Ekranlar İçin) */}
      <div className="block md:hidden flex justify-between items-center w-full">
        <div className="text-white text-xl font-bold">
          <Link href="/">
            <span className="cursor-pointer">Logo</span>
          </Link>
        </div>
        <button className="text-white" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Menü Öğeleri (Tablet ve Mobil Ekranlar İçin) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-gray-800 flex flex-col items-center justify-center">
          <button onClick={toggleMenu} className="absolute text-2xl top-0 right-0">x</button>
          <ul className="flex flex-col items-center justify-center space-y-4">
            <MenuItem href="/about" text="About" />
            <MenuItem href="/offices" text="Offices" />
            <MenuItem href="/contact" text="Contact" />
          </ul>
        </div>
      )}

      {/* Menü Öğeleri (Büyük Ekranlar İçin) */}
      <div className="hidden md:flex space-x-8 list-none">
        <MenuItem href="/about" text="About" />
        <MenuItem href="/offices" text="Offices" />
        <MenuItem href="/contact" text="Contact" />
      </div>
    </nav>
  );
};

interface MenuItemProps {
  href: string;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, text }) => {
  return (
    <li>
      <Link href={href}>
        <span className="text-white hover:text-gray-300 cursor-pointer">
          {text}
        </span>
      </Link>
    </li>
  );
};

export default Navbar;
