import React from "react";

export const HotelSection = ({ trip }) => {
  if (!trip?.hotels || trip.hotels.length === 0)
    return (
      <div className="mt-10 text-gray-500 text-center">
        No hotel recommendations found.
      </div>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">🏨 Hotel Recommendations</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {trip.hotels.map((hotel, index) => {
          if (typeof hotel === "object" && hotel !== null) {
            return (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{hotel.name || "Hotel"}</h3>
                {hotel.rating && (
                  <p className="text-gray-500 text-sm">⭐ {hotel.rating}</p>
                )}
              </div>
            );
          }
          return (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{hotel}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
