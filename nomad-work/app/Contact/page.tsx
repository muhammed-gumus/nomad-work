"use client";
import React, { useState } from "react";
import Map from "../../components/Maps";
import Navbar from "@/components/Navbar";

const descText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."; // Kullanmak istediğiniz özel metin

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/send-email", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("E-posta gönderildi");
        // İsteğe bağlı: Gönderim başarılı olduysa kullanıcıyı başka bir sayfaya yönlendirebilirsiniz.
      } else {
        console.error("E-posta gönderme hatası:", response.statusText);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">

      <div className="flex w-4/5 items-center justify-between md:flex-row flex-col gap-8 my-12 mx-4 md:mx-12">
        <div className="md:w-1/2 md:mr-6 md:flex flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4 underline">
            İletişim Bilgileri
          </h2>
          <p>Adres: Lorem Ipsum Cad. No:123, 34567 Şehir, Ülke</p>
          <p>Telefon: (123) 456-7890</p>
          <p>E-posta: info@example.com</p>

          <h2 className="text-3xl font-bold my-4 underline">İletişim Formu</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-2 rounded-md"
                />
              </div>
            </div>

            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full py-2 px-2 rounded-md"
            />

            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-2 px-2 rounded-md"
            />

            <label htmlFor="text">Mesaj</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              className="w-full py-8 px-2 rounded-md"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Gönder
            </button>
          </form>
        </div>
        <Map width="70%" height="400px" lat={38.0268432} lng={32.5101583} />
      </div>
    </div>
  );
};

export default ContactPage;
