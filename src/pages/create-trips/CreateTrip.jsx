import { Navbar } from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  selectBudgetOptions,
  SelectTravelsList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { Loading } from "@/components/common/Loading";
import { useNavigate } from "react-router-dom";

export const CreateTrip = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({
    location: null,
    noOfDays: "",
    budget: "",
    traveller: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Helper: Fetch Google Place Photo
  const getPlacePhoto = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
      );
      const data = await response.json();

      const photoRef = data?.result?.photos?.[0]?.photo_reference;
      if (photoRef) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoRef}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
      }
    } catch (err) {
      console.error("Error fetching place photo:", err);
    }
    return "/placeholder.jpg"; // fallback image
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.error("Google login error:", error),
  });

  // 🚀 Generate Trip using Gemini API
  const generateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData.location)
      return toast("Destination is required.");
    if (!formData.noOfDays || formData.noOfDays <= 0 || formData.noOfDays > 5)
      return toast("Number of days should be between 1 and 5.");
    if (!formData.budget)
      return toast("Budget selection is required.");
    if (!formData.traveller)
      return toast("Traveller details are required.");

    setLoading(true);

    try {
      // ✅ Fetch the place photo before generating
      const photoUrl = await getPlacePhoto(formData?.location?.value?.place_id);

      // 🧠 Smart Prompt
      const FINAL_PROMPT = `
        You are a travel planner AI.
        Create a ${formData?.noOfDays}-day itinerary for ${formData?.location?.label}.
        Traveller: ${formData?.traveller}.
        Budget: ${formData?.budget}.
        
        Please respond strictly in JSON format:
        {
          "hotels": ["Hotel 1", "Hotel 2", "Hotel 3"],
          "plans": ["Day 1 plan...", "Day 2 plan...", "Day 3 plan..."]
        }
      `;

      // ✅ Send prompt to Gemini once
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const aiResponse = result?.response?.text();
      console.log("🧠 Gemini Raw Output:", aiResponse);

      await saveTrip(aiResponse, photoUrl);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("An error occurred while generating your trip.");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Save AI-generated trip to Firebase
  const saveTrip = async (tripData, photoUrl) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));

    let parsedTripData = { hotels: [], plans: [] };

    try {
      parsedTripData = JSON.parse(tripData);
      if (Array.isArray(parsedTripData) && Array.isArray(parsedTripData[0])) {
        parsedTripData = {
          hotels: parsedTripData[0],
          plans: parsedTripData[1],
        };
      }
    } catch (error) {
      console.warn("⚠️ AI output not JSON. Using fallback parser.");

      const lines = tripData.split("\n").map((l) => l.trim()).filter(Boolean);
      const hotels = [];
      const plans = [];

      lines.forEach((line) => {
        if (
          line.toLowerCase().includes("hotel") ||
          line.toLowerCase().includes("resort") ||
          line.toLowerCase().includes("stay")
        ) {
          hotels.push(line.replace(/^\d+[\.\-\)]\s*/, "").trim());
        } else if (
          line.toLowerCase().includes("day") ||
          line.toLowerCase().includes("visit") ||
          line.toLowerCase().includes("explore")
        ) {
          plans.push(line.replace(/^\d+[\.\-\)]\s*/, "").trim());
        }
      });

      parsedTripData = { hotels, plans };
    }

    try {
      await setDoc(doc(db, "trips", docId), {
        userSelection: formData,
        tripData: parsedTripData,
        locationPhoto: photoUrl, // ✅ store image here
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString(),
      });

      toast.success("Trip successfully created!");
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("An error occurred while saving the trip.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialog(false);
        generateTrip();
      })
      .catch((error) => {
        console.error("Error fetching Google profile:", error);
        toast("Failed to fetch Google profile.");
      });
  };

  // 🧱 UI Section
  return (
    <>
      <Navbar />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
        <h2 className="font-bold text-3xl">
          Tell us your travel preferences ⛱️ 🌴
        </h2>
        <p className="mt-3 text-gray-500 text-xl">
          Just provide some basic information, and our trip planner will
          generate a customized itinerary based on your preferences.
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {/* Location Input */}
          <div>
            <h2 className="text-xl my-3 font-medium">
              What is your destination of choice? *
            </h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                value: place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          </div>

          {/* Number of Days */}
          <div>
            <h2 className="text-xl my-3 font-medium">
              How many days are you planning your trip? *
            </h2>
            <Input
              placeholder="Ex. 3"
              type="number"
              value={formData.noOfDays}
              onChange={(e) =>
                handleInputChange("noOfDays", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Budget Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget? *</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {selectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ${
                  formData?.budget === item.title
                    ? "shadow-lg border-black"
                    : ""
                }`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-gray-500 text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Traveller Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            Who are you travelling with? *
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ${
                  formData?.traveller === item.people
                    ? "shadow-lg border-black"
                    : ""
                }`}
                onClick={() => handleInputChange("traveller", item.people)}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-gray-500 text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Trip Button */}
        <div className="my-10 flex justify-center">
          <Button onClick={generateTrip} disabled={loading}>
            {loading ? (
              <>
                <Loading /> &nbsp; Generating Trip...
              </>
            ) : (
              "Generate Trip"
            )}
          </Button>
        </div>

        {/* Google Login Dialog */}
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/mainlogo.png" className="w-28 md:w-40 mx-auto" />
                <h2 className="font-bold text-lg mt-7 text-center">
                  Sign In with Google
                </h2>
                <p className="text-center text-gray-500">
                  Please sign in to generate and save your trip.
                </p>
                <Button
                  className="w-full mt-5 flex items-center justify-center gap-2"
                  onClick={handleLogin}
                >
                  <FcGoogle className="h-5 w-5" /> Sign In with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
