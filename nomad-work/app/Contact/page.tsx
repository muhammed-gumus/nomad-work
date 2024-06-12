"use client";
import React, { useState } from "react";
import Map from "../../components/Maps";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
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
        toast.success("Mesaj gönderildi");
        setFormData({ email: "", text: "" });
      } else {
        console.error("E-posta gönderme hatası:", response.statusText);
        toast.error("Mesaj gönderilemedi");
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
          <p>Adres: Ardıçlı Mah. Rauf Orbay Cad. 42250, Selçuklu/KONYA</p>
          <p>Telefon: 0(332) 205 15 00</p>
          <p>E-posta: muhendislik@ktun.edu.tr</p>

          <h2 className="text-3xl font-bold my-4 underline">İletişim Formu</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
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
              className="w-full text-start h-20 px-2 rounded-md"
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
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ContactPage;
