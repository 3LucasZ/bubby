import React from "react";
import { useNavigate } from "react-router-dom"; // if you use react-router

const FloatingHomeButton = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/"); // navigates to home route
  };

  return (
    <button
      onClick={goHome}
      aria-label="Go Home"
      className="fixed bottom-5 left-5 bg-blue-300 hover:bg-blue-400 text-white p-4 rounded-full shadow-lg transition"
      title="Home"
    >
      {/* Home icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"
        />
      </svg>
    </button>
  );
};

export default FloatingHomeButton;
