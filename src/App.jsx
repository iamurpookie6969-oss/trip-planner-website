import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import { CreateTrip } from "./pages/create-trips/CreateTrip";
import { MyTrips } from "./pages/my-trips/MyTrips";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔥 NEW LANDING PAGE */}
        <Route path="/" element={<Landing />} />

        {/* EXISTING FEATURES */}
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />

      </Routes>
    </Router>
  );
}

export default App;
