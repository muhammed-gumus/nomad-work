// Bu kısmı istediğiniz gibi düzenleyin
"use client";

import React, { useState } from "react";
import Navbar from "../Navbar/page";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(true);

  const generateUserId = () => {
    return Math.floor(Math.random() * 1000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
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
        setEmail("");
        setPassword("");
      } else {
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
          setUser(loginData.user_name);

          setUsername("");
          setPassword("");
          setError(null);
        } else {
          setError("Kullanıcı adı veya şifre hatalı");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(isRegister ? "Kayıt yapılamadı." : "Giriş yapılamadı.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />
      <h1 className="text-2xl font-bold mt-12 mb-8">
        {isRegister ? "Kullanıcı Kayıt Sayfası" : "Kullanıcı Giriş Sayfası"}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <p className="text-green-500">
          {isRegister
            ? `Kullanıcı başarıyla kaydedildi: ${username}`
            : "Giriş başarıyla gerçekleşti"}
        </p>
      )}
      <form onSubmit={handleSubmit} className="w-1/4 mx-auto">
        {isRegister && (
          <>
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
          </>
        )}
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
        <div>
          <button
            type="submit"
            className="w-full bg-white text-black p-2 rounded-md hover:text-yellow-500"
          >
            {isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </div>
      </form>
      <p
        className="mt-4 cursor-pointer text-blue-500"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Zaten üye misin? Giriş yap"
          : "Üye değil misin? Kayıt ol"}
      </p>
    </div>
  );
};

export default RegisterPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Page: React.FC = () => {
//   const [user, setUser] = useState("");
//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch("http://127.0.0.1:8000" + "/user/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id: "111" }),
//       });
//       console.log(response);
//       const font_data = await response.json();
//       console.log(font_data);
//       return font_data.user_name;
//     };

//     fetchData().then((user) => setUser(user));
//   }, []);
//   return (
//     <div className="flex w-full justify-center flex-col items-center my-16 gap-4">
//       {user}
//     </div>
//   );
// };

// export default Page;
