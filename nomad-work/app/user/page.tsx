"use client";

import React, { useState } from "react";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000" + "/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: "111" }), // Bu kısmı backend'e özel olarak düzenlemelisiniz.
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData.user_name);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Kullanıcı adı alınamadı.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kullanıcı Kayıt Sayfası</h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <p className="text-green-500">
          Kullanıcı adı başarıyla alındı: <strong>{username}</strong>
        </p>
      )}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Kayıt Ol
          </button>
        </div>
      </form>
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
