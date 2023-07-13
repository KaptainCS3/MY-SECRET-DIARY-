import ProtectRoute from "./components/ProtectRoute";
import DiaryEntry from "./pages/DiaryEntry";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Home from "./pages/Home";
const App = () => {
  return (
    <div className="flex items-center flex-col lg:w-full md:w-full">
      <Routes>
        {/* user home page */}
        <Route path="/" element={<Home />} />
        {/* protected route and dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
            <Dashboard />
            </ProtectRoute>
          }
        />
        <Route
          path="/new-entry"
          element={
            <ProtectRoute>
            <DiaryEntry />
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
