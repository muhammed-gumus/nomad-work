"use client";
import React from "react";
import Navbar from "../Navbar/page";
import Link from "next/link";
import Map from "../Maps/page";

const descText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."; // Kullanmak istediğiniz özel metin

const Page: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form bilgilerini işleme al
    // Örneğin, bu bilgileri bir API'ye gönderebilirsiniz
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />

      <div className="flex w-4/5 items-center justify-between md:flex-row flex-col gap-8 my-12 mx-4 md:mx-12">
        <div className="md:w-1/2 md:mr-6 md:flex flex flex-col  items-start">
          <h2 className="text-3xl font-bold mb-4 underline">
            İletişim Bilgileri
          </h2>
          <p>Adres: Lorem Ipsum Cad. No:123, 34567 Şehir, Ülke</p>
          <p>Telefon: (123) 456-7890</p>
          <p>E-posta: info@example.com</p>

          <h2 className="text-3xl font-bold my-4 underline">İletişim Formu</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full py-2 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full py-2 rounded-md"
                />
              </div>
            </div>

            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full py-2 rounded-md"
            />

            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full py-2 rounded-md"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Gönder
            </button>
          </form>
        </div>
        <Map />
      </div>
    </div>
  );
};

export default Page;
