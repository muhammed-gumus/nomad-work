// register.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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

  const isPasswordValid = (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }

    if (!/\d/.test(password)) {
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      return false;
    }

    if (!/[.,\-_]/.test(password)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      setError(
        "Şifre uygun değil. En az 8 karakter, 1 sayı, 1 büyük harf ve bir özel karakter içermelidir."
      );
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
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
        throw new Error(`HTTP hatası! Durum: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        setError(
          "Kullanıcı adı veya mail adresi başka bir kullanıcı tarafından kullanılıyor."
        );
      } else {
        setUser(result.user_name);
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setIsRegistrationSuccess(true);
        setError(null);
      }
    } catch (error) {
      console.error("Fetch hatası:", error);
      setError("Kullanıcı adı veya mail adresi zaten kullanılıyor.");
    }
  };

  return (
    <div className="flex flex-col items-center py-4 mt-8">
      <div className="flex flex-col px-8 py-4 items-center justify-center mt-8 bg-white bg-opacity-50 rounded-lg w-1/3">
        <h1 className="text-3xl font-bold mb-6">KAYIT OL</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-black"
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
                className="block text-sm font-medium text-black"
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
              className="block text-sm font-medium text-black"
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
            {isRegistrationSuccess ? (
              <Link href={"/Login"} className="w-full">
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
                <Link href={"/Login"}>Zaten üye misin? Giriş yap!</Link>
              </div>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
