"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <nav className="p-8 px-24 flex justify-between items-center w-full">
      {/* Logo */}
      <div className="text-white text-2xl font-bold hidden md:block">
        <Link href="/">
          <span className="cursor-pointer">Logo</span>
        </Link>
      </div>

      {/* Burger Menü (Tablet ve Mobil Ekranlar İçin) */}
      <div className="block md:hidden flex justify-between items-center w-full" ref={menuRef}>
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
        <div className="md:hidden absolute top-0 left-0 w-full h-full bg-gray-800 flex flex-col items-end p-4">
          <button className="text-white text-2xl" onClick={closeMenu}>
            ✕
          </button>
          <ul className="flex flex-col space-y-4">
            <MenuItem href="/about" text="About" closeMenu={closeMenu} />
            <MenuItem href="/offices" text="Offices" closeMenu={closeMenu} />
            <MenuItem href="/contact" text="Contact" closeMenu={closeMenu} />
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
  closeMenu: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, text, closeMenu }) => {
  const handleClick = () => {
    closeMenu();
  };

  return (
    <li>
      <Link href={href}>
        <span className="text-white hover:text-gray-300 cursor-pointer" onClick={handleClick}>
          {text}
        </span>
      </Link>
    </li>
  );
};

export default Navbar;
