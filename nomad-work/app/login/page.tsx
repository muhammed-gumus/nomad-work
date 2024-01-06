// login.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde, eğer kullanıcı daha önce giriş yapmışsa otomatik olarak ana sayfaya yönlendir
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      // Burada gerçek bir authentication işlemi yapmanız gerekebilir (örneğin, token'ı doğrulamak)
      const storedUsername = localStorage.getItem("username") || null;
      setIsAuthenticated(true);
      setUser(storedUsername);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const loginData = await response.json();

      if (loginData.message === "Giriş başarıyla gerçekleşti") {
        console.log("Kullanıcı bilgileri:", loginData);
        setIsAuthenticated(true);
        setUsername("");
        setPassword("");
        setError(null);
        setUser(loginData.user_name);

        // JWT'yi localStorage'e kaydet
        localStorage.setItem("jwtToken", loginData.access_token);
        // Kullanıcı adını localStorage'e kaydet
        localStorage.setItem("username", loginData.user_name);

        router.push("/", { scroll: false });
      } else {
        setError("Kullanıcı adı veya şifre hatalı");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Giriş yapılamadı.");
    }
  };

  const handleLogout = () => {
    // Kullanıcının oturumunu sonlandır
    setIsAuthenticated(false);
    setUser(null);

    // localStorage'deki ilgili bilgileri temizle
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");

    // İstediğiniz yönlendirmeyi yapabilirsiniz
    router.push("/login", { scroll: false });
  };

  // Eğer kullanıcı zaten oturum açık değilse giriş formunu göster
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-between py-4">
        <h1 className="text-2xl font-bold mt-12 mb-8">
          Kullanıcı Giriş Sayfası
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="w-1/4 mx-auto">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="w-full bg-white text-black p-2 rounded-md hover:text-yellow-500"
            >
              Giriş Yap
            </button>
            <Link href={"/register"}>Üye değil misin? Kayıt ol!</Link>
          </div>
        </form>
      </div>
    );
  }

  // Eğer kullanıcı zaten oturum açık ise çıkış yap butonunu göster
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <p className="">Tekrar bekleriz. Bizi unutma🥲</p>
      <button
        onClick={handleLogout}
        className="w-1/6 bg-white text-black p-2 rounded-md hover:text-yellow-500"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default LoginPage;
