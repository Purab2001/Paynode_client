import React, { useRef, useEffect } from "react";

const TaskDropdown = ({ options, value, onChange, label = "Select" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-left px-3 py-2 border rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400 focus:border-blue-400 dark:focus:border-blue-400"
      >
        <span className="block truncate">{value || label}</span>
        <svg
          className={`w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
            className="text-gray-600 dark:text-gray-400"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md shadow-lg mt-1 py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer text-sm ${
                value === option
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-900 dark:text-gray-200"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskDropdown;
