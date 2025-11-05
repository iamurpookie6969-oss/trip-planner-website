import React from "react";

export const VisitSection = ({ plans }) => {
  if (!Array.isArray(plans) || plans.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl mb-3">📍 Places to Visit</h2>
      <div className="space-y-4">
        {plans.map((plan, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">Day {i + 1}</h3>
            <p className="text-gray-600 mt-1">{plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
