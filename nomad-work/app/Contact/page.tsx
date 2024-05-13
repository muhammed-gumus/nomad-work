"use client";
import React, { useState, useEffect } from "react";
import Map from "../../components/Maps";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthModal from "@/components/AuthModal";
import AuthRequiredModal from "@/components/AuthRequiredModal.tsx";

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState(false);

  useEffect(() => {
    // localStorage'dan jwtToken ve username kontrolü yap
    const jwtToken = localStorage.getItem("jwtToken");
    const storedUsername = localStorage.getItem("username");

    if (jwtToken && storedUsername) {
      setIsAuthenticated(true);
      setIsAuthModalOpen(true);
    } else {
      setIsAuthRequiredModalOpen(true);
    }
  }, []);

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthRequiredModalClose = () => {
    setIsAuthRequiredModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kullanıcı adını localStorage'dan al
    const storedUsername = localStorage.getItem("username");

    console.log("Stored Username:", storedUsername);
    console.log("Form Username:", formData.username);

    // Remove quotation marks from storedUsername if present
    const cleanedStoredUsername = storedUsername
      ? storedUsername.replace(/"/g, "")
      : "";

    // Kullanıcı adı kontrolü yap
    if (
      cleanedStoredUsername &&
      formData.username.trim().toLowerCase() ===
        cleanedStoredUsername.trim().toLowerCase()
    ) {
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
          // İsteğe bağlı: Gönderim başarılı olduysa kullanıcıyı başka bir sayfaya yönlendirebilirsiniz.
        } else {
          console.error("E-posta gönderme hatası:", response.statusText);
          toast.error("Mesaj gönderilemedi"); // Display error toast
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    } else {
      // Kullanıcı adı hatalı ise buraya girecek
      console.log("Kullanıcı adı hatalı!");
      toast.error("Kullanıcı adı hatalı!");
      // Optional: Show a different message or handle this case as needed
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-between py-4">
      {isAuthenticated && (
        <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
      )}
      {!isAuthenticated && (
        <AuthRequiredModal
          isOpen={isAuthRequiredModalOpen}
          onClose={handleAuthRequiredModalClose}
        />
      )}
      <div className="flex w-4/5 items-center justify-between md:flex-row flex-col gap-8 my-12 mx-4 md:mx-12">
        <div className="md:w-1/2 md:mr-6 md:flex flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4 underline">
            İletişim Bilgileri
          </h2>
          <p>Adres: Ardıçlı Mah. Rauf Orbay Cad. 42250, Selçuklu/KONYA</p>
          <p>Telefon: 0(332) 205 15 00</p>
          <p>E-posta: muhendislik@ktun.edu.tr</p>

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
