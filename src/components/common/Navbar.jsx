import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

export const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDailog, setOpenDailog] = useState(false);

  // 🌙 Dark Mode State
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  // 🔐 Google Login
  const handleLogin = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response),
    onError: (error) => console.log(error),
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
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDailog(false);
        window.location.reload();
      });
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-background text-foreground">
      
      {/* Logo */}
      <Link to={"/"}>
        <img src="/mainlogo.png" className="w-28 md:w-40" />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* 🌙 TOGGLE SWITCH */}
        <div
          onClick={toggleDarkMode}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
            dark ? "bg-indigo-600" : "bg-muted-300"
          }`}
        >
          <div
            className={`bg-background w-5 h-5 rounded-full shadow-md transform transition ${
              dark ? "translate-x-6" : ""
            }`}
          />
        </div>

        {/* USER / AUTH */}
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <Link to={"/create-trip"}>
              <Button variant="outline" className="rounded-full">
                Create Trips
              </Button>
            </Link>

            <Link to={"/my-trips"}>
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="rounded-full h-[35px] w-[35px] cursor-pointer"
                />
              </PopoverTrigger>

              <PopoverContent className="w-40 cursor-pointer">
                <h2
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Dialog open={openDailog} onOpenChange={setOpenDailog}>
            <DialogTrigger asChild>
              <Button>Sign In</Button>
            </DialogTrigger>

            <DialogContent className="bg-background text-foreground">
              <DialogHeader>
                <DialogDescription>
                  <img src="/mainlogo.png" className="w-28 md:w-40" />

                  <h2 className="font-bold text-lg mt-7">
                    Sign In with Google
                  </h2>

                  <p>Sign in to continue</p>

                  <Button
                    className="w-full mt-5 flex items-center gap-2"
                    onClick={handleLogin}
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign In with Google
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
