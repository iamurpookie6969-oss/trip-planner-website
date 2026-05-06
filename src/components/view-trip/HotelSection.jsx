import React from "react";

export const HotelSection = ({ trip }) => {
  if (!trip?.hotels || trip.hotels.length === 0)
    return (
      <div className="mt-10 text-muted-foreground text-center">
        No hotel recommendations found.
      </div>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        🏨 Hotel Recommendations
      </h2>

      <div className="grid md:grid-cols-3 gap-5">
        {trip.hotels.map((hotel, index) => {
          if (typeof hotel === "object" && hotel !== null) {
            return (
              <div
                key={index}
                className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {hotel.name || "Hotel"}
                </h3>

                {hotel.rating && (
                  <p className="text-muted-foreground text-sm">
                    ⭐ {hotel.rating}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div
              key={index}
              className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{hotel}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};
