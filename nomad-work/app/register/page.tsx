// register.tsx
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const generateUserId = () => {
    return Math.floor(Math.random() * 1000).toString();
  };

  useEffect(() => {
    if (isRegistrationSuccess) {
      toast.success("Kullanıcı başarıyla kaydedildi", {
        position: "bottom-right",
      });

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  }, [isRegistrationSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: generateUserId(),
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData.user_name);

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");

      setIsRegistrationSuccess(true);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Kayıt yapılamadı.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />
      <h1 className="text-2xl font-bold mt-12 mb-8">Kullanıcı Kayıt Sayfası</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="w-1/4 mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-600"
            >
              İsim
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-600"
            >
              Soyisim
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Mail Adresi
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
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
          {isRegistrationSuccess ? (
            <Link href={"/login"} className="w-full">
              <button
                type="submit"
                className="w-full bg-white text-black p-2 rounded-md hover:text-yellow-500"
              >
                Giriş Yap
              </button>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <button
                type="submit"
                className="w-full bg-white text-black p-2 rounded-md hover:text-yellow-500"
              >
                Kayıt Ol
              </button>
              <Link href={"/login"}>Zaten üye misin? Giriş yap!</Link>
            </div>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
