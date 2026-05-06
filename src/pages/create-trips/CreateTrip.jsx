import ChatBot from "@/components/ChatBot";
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

  // ✅ Get Image
  const getPlacePhoto = async (place) => {
    try {
      const photoRef = place?.value?.photos?.[0]?.photo_reference;

      if (photoRef) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoRef}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
      }

      const locationName = encodeURIComponent(place?.label || "travel");
      return `https://source.unsplash.com/1600x900/?${locationName}`;
    } catch {
      return "/placeholder.jpg";
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Google Login
  const handleLogin = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (err) => console.log(err),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        generateTrip();
      });
  };

  // ✅ Generate Trip
  const generateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData.location) return toast("Select destination");
    if (!formData.noOfDays) return toast("Enter days");
    if (!formData.budget) return toast("Select budget");
    if (!formData.traveller) return toast("Select traveller");

    setLoading(true);

    try {
      const photoUrl = await getPlacePhoto(formData.location);

      const prompt = `
      Create a ${formData.noOfDays}-day trip plan for ${formData.location.label}.
      Budget: ${formData.budget}
      Traveller: ${formData.traveller}

      Return ONLY JSON:
      {
        "hotels": ["Hotel1","Hotel2"],
        "plans": ["Day1 plan","Day2 plan"]
      }
      `;

      const result = await chatSession.sendMessage(prompt);
      const aiResponse = result?.response?.text();

      await saveTrip(aiResponse, photoUrl);
    } catch (err) {
      console.error(err);
      toast("Error generating trip");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Trip
  const saveTrip = async (tripData, photoUrl) => {
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));

    let parsed = { hotels: [], plans: [] };

    try {
      parsed = JSON.parse(tripData);
    } catch {
      parsed.plans = tripData.split("\n");
    }

    await setDoc(doc(db, "trips", docId), {
      userSelection: formData,
      tripData: parsed,
      locationPhoto: photoUrl,
      userEmail: user?.email,
      id: docId,
      createdAt: new Date().toISOString(),
    });

    toast.success("Trip Created!");
    navigate(`/view-trip/${docId}`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences ⛱️ 🌴
      </h2>

      <p className="mt-3 text-muted-foreground text-lg">
        Provide details and get a smart itinerary ✨
      </p>

      {/* LOCATION */}
      <div className="mt-10">
        <h2 className="text-xl font-medium mb-3">
          Destination *
        </h2>

        <GooglePlacesAutocomplete
  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
  selectProps={{
    value: place,
    onChange: (v) => {
      setPlace(v);
      handleInputChange("location", v);
    },
    styles: {
      control: (base) => ({
        ...base,
        backgroundColor: "transparent",
        borderColor: "hsl(var(--border))",
        color: "hsl(var(--foreground))",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }),
      singleValue: (base) => ({
        ...base,
        color: "hsl(var(--foreground))",
      }),
      input: (base) => ({
        ...base,
        color: "hsl(var(--foreground))",
      }),
    },
  }}
/>
      </div>

      {/* DAYS */}
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-3">Days *</h2>

        <Input
          type="number"
          placeholder="Ex. 3"
          className="bg-background border-border"
          onChange={(e) =>
            handleInputChange("noOfDays", e.target.value)
          }
        />
      </div>

      {/* BUDGET */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-3">Budget *</h2>

        <div className="grid grid-cols-3 gap-5">
          {selectBudgetOptions.map((item, i) => (
            <div
              key={i}
              onClick={() =>
                handleInputChange("budget", item.title)
              }
              className={`p-4 rounded-lg border border-border bg-card cursor-pointer transition ${
                formData.budget === item.title
                  ? "border-primary shadow-lg"
                  : ""
              }`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TRAVELLER */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-3">Traveller *</h2>

        <div className="grid grid-cols-3 gap-5">
          {SelectTravelsList.map((item, i) => (
            <div
              key={i}
              onClick={() =>
                handleInputChange("traveller", item.people)
              }
              className={`p-4 rounded-lg border border-border bg-card cursor-pointer ${
                formData.traveller === item.people
                  ? "border-primary shadow-lg"
                  : ""
              }`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-10">
        <Button onClick={generateTrip} disabled={loading}>
          {loading ? <Loading /> : "Generate Trip"}
        </Button>
      </div>

      {/* LOGIN */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <h2 className="text-center font-bold text-lg">
                Login Required
              </h2>

              <Button
                onClick={handleLogin}
                className="w-full mt-5"
              >
                <FcGoogle /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <ChatBot />
    </div>
  );
};
