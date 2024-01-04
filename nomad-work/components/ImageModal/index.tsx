// Modal.tsx
import React from "react";

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-8 rounded-lg relative w-[500px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Full-size Image" className="max-w-full max-h-full" />
      </div>
    </div>
  );
};

export default Modal;
