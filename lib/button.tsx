// lib/button.tsx
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-primary-rgb text-white font-semibold rounded-lg shadow-md hover:bg-primary-rgb/90 focus:outline-none focus:ring-2 focus:ring-primary-rgb/70"
    >
      {label}
    </button>
  );
};

export default Button;
