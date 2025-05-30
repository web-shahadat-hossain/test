import React from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  className = "",
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:ring-offset-2
        ${checked ? "bg-[#FF4B26]" : "bg-gray-200"}
        ${className}
      `}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full 
          bg-white shadow-sm transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default Toggle;
