import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { HotelSection } from "@/components/view-trip/HotelSection";
import { InfoSection } from "@/components/view-trip/InfoSection";
import { VisitSection } from "@/components/view-trip/VisitSection";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch trip data from Firestore
  const getTripData = async () => {
    try {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTripData(docSnap.data());
      } else {
        toast.error("No Trip Found");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Error loading trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripData();
  }, [tripId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg text-gray-500">
        Loading trip details...
      </div>
    );

  if (!tripData)
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg text-gray-500">
        No trip found.
      </div>
    );

  const { userSelection, tripData: tripDetails, locationPhoto } = tripData;

  return (
    <div>
      <Navbar />

      {/* 🖼️ Destination Banner */}
      <div className="p-6 md:px-20 lg:px-44 xl:px-56">
        {locationPhoto ? (
          <img
            src={locationPhoto}
            alt={userSelection?.location?.label || "Destination"}
            className="w-full h-[300px] object-cover rounded-xl shadow-md"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* 📍 Trip Info Sections */}
      <div className="p-10 md:px-20 lg:px-44 xl:px-56 space-y-10">
        <InfoSection trip={userSelection} />
        <HotelSection trip={tripDetails} />
        <VisitSection trip={tripDetails} />
      </div>

      <Footer />
    </div>
  );
};
