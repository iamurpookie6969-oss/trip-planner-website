import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "./pages/Landing.jsx"; // ✅ IMPORTANT
import { CreateTrip } from "./pages/create-trips/CreateTrip.jsx";
import { ViewTrip } from "./pages/view-trips/ViewTrip.jsx";
import { MyTrips } from "./pages/my-trips/MyTrips.jsx";

import { Toaster } from "./components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />, // ✅ MUST BE THIS
      },
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "/view-trip/:tripId",
        element: <ViewTrip />,
      },
      {
        path: "/my-trips",
        element: <MyTrips />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_API_KEY}
    >
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
