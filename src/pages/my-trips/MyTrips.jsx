import { Navbar } from "@/components/common/Navbar";
import { MyTripCard } from "@/components/user-trip/MyTripCard";
import { db } from "@/service/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  const getUsertrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "trips"),
      where("userEmail", "==", user?.email)
    );

    const querySnapshot = await getDocs(q);
    setUserTrips([]);

    querySnapshot.forEach((doc) => {
      setUserTrips((prev) => [...prev, doc.data()]);
    });
  };

  useEffect(() => {
    getUsertrips();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
        <h2 className="font-bold text-2xl text-foreground">My Trips</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {userTrips?.length > 0 ? (
            userTrips.map((item, index) => (
              <MyTripCard key={index} item={item} index={index} />
            ))
          ) : (
            [1, 2, 3].map((item, index) => (
              <div
                key={index}
                className="h-[250px] w-full bg-muted animate-pulse rounded-md"
              ></div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
