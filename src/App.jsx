import { Outlet } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Hero } from "./components/dashboard/Hero";

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      {/* If using routing layout */}
      <Outlet />

      {/* OR if homepage */}
      {/* <Hero /> */}
    </div>
  );
}

export default App;
