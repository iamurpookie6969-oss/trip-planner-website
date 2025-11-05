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

  if (loading) return <p className="text-center mt-10">Loading trip...</p>;

  if (!tripData)
    return <p className="text-center mt-10">No trip found.</p>;

  return (
    <div>
      <Navbar />
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        <InfoSection trip={tripData.userSelection} />
        <HotelSection hotels={tripData.tripData.hotels} />
        <VisitSection plans={tripData.tripData.plans} />
      </div>
      <Footer />
    </div>
  );
};
