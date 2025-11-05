import React from "react";
import { Calendar, Users, Wallet } from "lucide-react";

export const InfoSection = ({ trip }) => {
  if (!trip) return null;

  const location = trip?.location?.label || "Unknown location";
  const days = trip?.noOfDays || "N/A";
  const budget = trip?.budget || "N/A";
  const traveller = trip?.traveller || "N/A";

  return (
    <div className="mt-5">
      <div className="w-full h-60 md:h-80 bg-gray-200 rounded-xl overflow-hidden">
        <img
          src={`https://source.unsplash.com/1200x600/?${encodeURIComponent(location)},travel`}
          alt={location}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-5">
        <h2 className="font-bold text-2xl">{location}</h2>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{days} Days</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <Wallet className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">{budget}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm">No. Of Traveler: {traveller}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
