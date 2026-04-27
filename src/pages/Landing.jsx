import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-100">
      
      <h1 className="text-4xl font-bold mb-4">
        Discover Your Next Adventure with AI
      </h1>

      <p className="text-gray-600 mb-6">
        Personalized itineraries at your fingertips
      </p>

      <button
        onClick={() => navigate("/create-trip")}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Get Started
      </button>

    </div>
  );
};

export default Landing;
