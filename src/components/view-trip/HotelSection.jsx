import React from "react";

export const HotelSection = ({ hotels }) => {
  if (!Array.isArray(hotels) || hotels.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl mb-3">🏨 Hotel Recommendations</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotels.map((hotel, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{hotel}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

