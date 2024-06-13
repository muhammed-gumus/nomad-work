// AuthRequiredModal.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [zIndex, setZIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    setZIndex(isOpen ? 1 : -1);
  }, [isOpen]);

  const handleRedirect = () => {
    router.push("/Login");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
      style={{ zIndex }}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-12 flex flex-col items-center rounded-md z-10">
        <p className="text-black text-2xl font-semibold mb-4">
          Giriş yapmanız gerekmektedir!
        </p>
        <button
          onClick={handleRedirect}
          className="bg-yellow-400 text-xl w-1/2 text-white mt-2 py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring focus:border-yellow-300"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
