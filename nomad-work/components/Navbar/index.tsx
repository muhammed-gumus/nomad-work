// components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isUserLoggedOut?: boolean; 
}

const Navbar: React.FC<NavbarProps> = ({ isUserLoggedOut = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setLoggedInUsername(username);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const username = localStorage.getItem("username");
      if (username !== loggedInUsername) {
        setLoggedInUsername(username || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loggedInUsername]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    setLoggedInUsername(null);
    router.push("/Login");
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isUserLoggedOut) {
      setLoggedInUsername(null);
    }
  }, [isUserLoggedOut]);

  return (
    <nav className="py-2 px-24 flex justify-between items-center w-full text-black bg-white rounded-sm">
      <div className="text-2xl font-bold hidden md:block">
        <Link href="/">
          <img
            src="/images/logo.jpeg"
            className="cursor-pointer w-20 rounded-full"
            alt="Logo"
          />
        </Link>
      </div>

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

      {isMenuOpen && (
        <div className="absolute top-0 left-0 right-0 w-full h-32 bg-white flex items-center justify-center">
          <button
            onClick={toggleMenu}
            className="absolute p-4 right-0 top-0 text-black hover:text-gray-400"
          >
            x
          </button>
          <ul className="flex gap-2">
            <MenuItem href="/About" text="Hakkımızda" />
            <MenuItem href="/Discover" text="Keşfet" />
            <MenuItem href="/Contact" text="İletişim" />
            {loggedInUsername ? (
              <li onClick={handleLogout} className="cursor-pointer hover:text-yellow-400">Çıkış Yap</li>
            ) : (
              <MenuItem href="/Register" text="Giriş Yap/Kayıt Ol" />
            )}
          </ul>
        </div>
      )}

      <div className="hidden md:flex space-x-4 list-none items-center">
        <MenuItem href="/About" text="Hakkımızda" />
        <MenuItem href="/Discover" text="Keşfet" />
        <MenuItem href="/Contact" text="İletişim" />
        {loggedInUsername ? (
          <li onClick={handleLogout} className="cursor-pointer hover:text-yellow-400">Çıkış Yap</li>
        ) : (
          <MenuItem href="/Register" text="Giriş Yap/Kayıt Ol" />
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
