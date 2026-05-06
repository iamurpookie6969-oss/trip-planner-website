import { Outlet } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
