// Modal.tsx
import React from "react";

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="rounded-lg relative w-[550px]">
        <div className="bg-blue">
          <button
            onClick={onClose}
            className="absolute color-red top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <path
                fill="#e3c400"
                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
              ></path>
              <path
                fill="#fff"
                d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
              ></path>
              <path
                fill="#fff"
                d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
              ></path>
            </svg>
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Full-size Image"
          className="max-w-full max-h-full"
        />
      </div>
    </div>
  );
};

export default Modal;
