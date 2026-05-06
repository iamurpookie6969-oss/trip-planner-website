import { Outlet } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Hero } from "./components/dashboard/Hero";

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
