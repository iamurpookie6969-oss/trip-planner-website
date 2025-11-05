import React from "react";

export const VisitSection = ({ trip }) => {
  if (!trip?.plans || trip.plans.length === 0)
    return (
      <div className="mt-10 text-gray-500 text-center">
        No itinerary found.
      </div>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">📍 Places to Visit</h2>
      <div className="space-y-4">
        {trip.plans.map((plan, index) => {
          // ✅ If it's an object, show its fields
          if (typeof plan === "object" && plan !== null) {
            return (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-1">
                  {plan.Day || `Day ${index + 1}`}
                </h3>
                <p className="text-gray-600 text-sm">
                  🏞️ {plan.Itinerary || plan.Plan || "No details available"}
                </p>
                {plan.Theme && (
                  <p className="text-gray-500 text-xs">🎨 Theme: {plan.Theme}</p>
                )}
                {plan.BestTimeToVisit && (
                  <p className="text-gray-500 text-xs">
                    🕒 Best Time: {plan.BestTimeToVisit}
                  </p>
                )}
              </div>
            );
          }

          // ✅ Otherwise, render it as text
          return (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-1">Day {index + 1}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{plan}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
