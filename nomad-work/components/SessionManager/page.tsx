"use client";
import { useEffect } from "react";

const SessionManager: React.FC = () => {
  useEffect(() => {
    const handleUserInteraction = () => {
      // Kullanıcı etkileşimi algılandığında, oturumu güncelleme işlemleri burada yapılabilir
      localStorage.setItem("lastInteractionTime", Date.now().toString()); // Son etkileşim zamanını güncelle

      console.log("Kullanıcı etkileşimde bulundu");
    };

    // Kullanıcı etkileşimini izleme
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("keypress", handleUserInteraction);

    // Temizleme işlemi
    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("keypress", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const lastInteractionTime = parseInt(
        localStorage.getItem("lastInteractionTime") || "0",
        10
      );
      const currentTime = Date.now();
      const sessionTimeout = 10 * 60 * 1000; // 5 dakika

      if (currentTime - lastInteractionTime > sessionTimeout) {
        // Oturumu sonlandır
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        localStorage.removeItem("lastInteractionTime"); // Son etkileşim zamanını da sil
        console.log("Oturum süresi aşıldı, oturum sonlandırıldı.");
      }
    };

    const interval = setInterval(checkSession, 60000); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default SessionManager;
