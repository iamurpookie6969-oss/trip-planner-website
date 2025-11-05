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

  const getTripData = async () => {
    try {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTripData(docSnap.data());
      } else {
        console.log("No such document!");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Navbar />
        <p className="text-lg text-gray-600 mt-10">Loading trip details...</p>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Navbar />
        <p className="text-lg text-gray-600 mt-10">No trip found.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        {/* Information Section */}
        <InfoSection trip={tripData} />

        {/* Hotels Section */}
        {tripData?.tripData?.hotels && Array.isArray(tripData.tripData.hotels) && (
          <HotelSection trip={tripData} />
        )}

        {/* Visit / Daily Plan Section */}
        {tripData?.tripData?.plans && Array.isArray(tripData.tripData.plans) && (
          <VisitSection trip={tripData} />
        )}
      </div>
      <Footer />
    </div>
  );
};

