// Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    // Kullanıcı girişi durumuna göre localStorage'den kullanıcı adını al
    if (isAuthenticated) {
      setLoggedInUsername(localStorage.getItem("username") || "");
    }
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sayfa boyutunu dinleme
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        // Eğer büyük ekrana geçiş yaptıysak ve menü açıksa, menüyü kapat
        setIsMenuOpen(false);
      }
    };

    // Pencere boyutu değiştiğinde handleResize işlevini çağır
    window.addEventListener("resize", handleResize);

    // Temizlik
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <nav className="p-8 px-24 flex justify-between items-center w-full text-black bg-white rounded-sm">
      {/* Logo */}
      <div className="text-2xl font-bold hidden md:block">
        <Link href="/">
          <span className="cursor-pointer">Logo</span>
        </Link>
      </div>

      {/* Burger Menü (Tablet ve Mobil Ekranlar İçin) */}
      <div className="block md:hidden flex justify-center items-center w-full">
        <div className="text-xl font-bold">
          <Link href="/">
            <span className="cursor-pointer">Logo</span>
          </Link>
        </div>
        <button onClick={toggleMenu} className="ml-auto">
          ☰
        </button>
      </div>

      {/* Menü Öğeleri (Tablet ve Mobil Ekranlar İçin) */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 right-0 w-full h-32 bg-white flex items-center justify-center">
          <button
            onClick={toggleMenu}
            className="absolute p-4 right-0 top-0 text-black hover:text-gray-400"
          >
            x
          </button>
          <ul className="flex gap-4">
            <MenuItem href="/About" text="About" />
            <MenuItem href="/discover" text="Discover" />
            <MenuItem href="/Contact" text="Contact" />
            <MenuItem href="/register" text="Login/Register" />
          </ul>
        </div>
      )}

      {/* Menü Öğeleri (Büyük Ekranlar İçin) */}
      <div className="hidden md:flex space-x-8 list-none">
        {isAuthenticated ? (
          // Kullanıcı giriş yaptıysa, kullanıcının adını göster
          <div className="flex items-center">
            <span className="mr-2 cursor-pointer">{loggedInUsername}</span>
            <Image
              src="/avatar.jpg" // Eklediğiniz avatar görselinin yolu
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="ml-2 cursor-pointer">Profil</span>
          </div>
        ) : (
          // Kullanıcı giriş yapmadıysa login/register linklerini göster
          <div className="flex space-x-4">
            <MenuItem href="/About" text="About" />
            <MenuItem href="/discover" text="Discover" />
            <MenuItem href="/Contact" text="Contact" />
            <MenuItem href="/register" text="Login/Register" />
          </div>
        )}
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
        <span className="hover:text-yellow-400 cursor-pointer">{text}</span>
      </Link>
    </li>
  );
};

export default Navbar;
