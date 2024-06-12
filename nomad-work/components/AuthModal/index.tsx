// AuthModal.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // localStorage'dan kontrol et
    const isModalConfirmed = localStorage.getItem('isModalConfirmed');
    if (isModalConfirmed === 'true') {
      setIsConfirmed(true);
    }
  }, []);

  const handleRefresh = () => {
    setIsConfirmed(true);
    localStorage.setItem('isModalConfirmed', 'true');
    window.location.reload();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen && !isConfirmed ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-12 flex flex-col items-center rounded-md z-10">
        <p className="text-black text-2xl font-semibold mb-2">Hoşgeldin!</p>
        <p className="text-black text-2xl font-semibold mb-4">Nomad Work ile keşfetmeye başla...</p>
        <button
          onClick={handleRefresh}
          className="bg-yellow-400 text-xl w-1/2 text-white mt-2 py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring focus:border-yellow-300"
        >
          Keşfet
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
