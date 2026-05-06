import React from "react";

export const VisitSection = ({ trip }) => {
  if (!trip?.plans || trip.plans.length === 0)
    return (
      <div className="mt-10 text-muted-foreground text-center">
        No itinerary found.
      </div>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        📍 Places to Visit
      </h2>

      <div className="space-y-4">
        {trip.plans.map((plan, index) => {
          // 🧠 Handle structured JSON objects
          if (typeof plan === "object" && plan !== null) {
            return (
              <div
                key={index}
                className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-1">
                  {plan.day || `Day ${index + 1}`}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  🏞️ {plan.activities || plan.itinerary || "No activities listed."}
                </p>

                {plan.theme && (
                  <p className="text-muted-foreground text-xs mt-1">
                    🎨 Theme: {plan.theme}
                  </p>
                )}

                {plan.bestTimeToVisit && (
                  <p className="text-muted-foreground text-xs">
                    🕒 Best Time: {plan.bestTimeToVisit}
                  </p>
                )}
              </div>
            );
          }

          // 🧾 Plain text plans
          return (
            <div
              key={index}
              className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-1">Day {index + 1}</h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {plan}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
