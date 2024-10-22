// SessionManager.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface SessionManagerProps {
  onLogout: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ onLogout }) => {
  const router = useRouter();

  useEffect(() => {
    const handleUserInteraction = () => {
      localStorage.setItem("lastInteractionTime", Date.now().toString());
      console.log("Kullanıcı etkileşimde bulundu");
    };

    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("keypress", handleUserInteraction);

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
      const sessionTimeout = 3 * 60 * 1000; // 3 dakika

      if (currentTime - lastInteractionTime > sessionTimeout) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        localStorage.removeItem("lastInteractionTime");
        console.log("Oturum süresi aşıldı, oturum sonlandırıldı.");
        onLogout(); 
        router.push("/Login"); 
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [router, onLogout]);

  return null;
};

export default SessionManager;
