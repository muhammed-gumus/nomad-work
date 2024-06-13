// login.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/useLocalStorage";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [localUserName, setLocalUserName] = useLocalStorage("username", null);
  const [localToken, setLocalToken] = useLocalStorage("jwtToken", null);
  const [isModalConfirmed, setIsModalConfirmed] = useLocalStorage(
    "isModalConfirmed",
    true
  );

  useEffect(() => {
    if (localToken) {
      setIsAuthenticated(true);
      setUser(localUserName);
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
      console.log(loginData, "login data");

      if (loginData.message === "Giriş başarıyla gerçekleşti") {
        setIsAuthenticated(true);
        setUsername("");
        setPassword("");
        setError(null);
        setUser(loginData.user_name);

        setLocalToken(loginData.access_token);
        setLocalUserName(loginData.user_name);

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
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");

    setIsModalConfirmed(false);

    router.push("/Login", { scroll: false });

    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-between py-4 mt-8">
        <div className="flex flex-col px-8 py-4 items-center justify-center mt-8 bg-white bg-opacity-50 rounded-lg w-1/3">
          <h1 className="text-3xl font-bold mb-8">GİRİŞ YAP</h1>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full mx-auto">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-black"
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
                className="block text-sm font-medium text-black"
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
              <Link href={"/Register"}>Üye değil misin? Kayıt ol!</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 mt-8">
      <div className="flex flex-col px-8 py-6 items-center justify-center mt-8 bg-white bg-opacity-50 gap-4 rounded-lg w-2/5">
        <p className="text-xl">
          Bizi unutma <span className="font-bold italic">{user}</span>. Tekrar
          görüşmek üzere...{" "}
        </p>
        <button
          onClick={handleLogout}
          className="w-1/2 bg-white text-black px-4 py-2 rounded-md hover:text-yellow-500"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
