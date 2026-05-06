import { Outlet } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Navbar always visible */}
      <Navbar />

      <Outlet />
    </div>
  );
}

export default App;
