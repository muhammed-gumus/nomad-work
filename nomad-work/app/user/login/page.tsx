// login.tsx
"use client";

import React, { useState } from "react";
import Navbar from "../../Navbar/page";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setUsername("");
        setPassword("");
        setError(null);
        setUser(loginData.user_name);
      } else {
        setError("Kullanıcı adı veya şifre hatalı");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Giriş yapılamadı.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />
      <h1 className="text-2xl font-bold mt-12 mb-8">Kullanıcı Giriş Sayfası</h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && <p className="text-green-500">Giriş başarıyla gerçekleşti</p>}

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
          <Link href={"/user/login"}>Zaten üye misin? Giriş yap!</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
