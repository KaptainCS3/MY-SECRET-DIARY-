import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectRoute from "./components/ProtectRoute";
import { useAppSelector } from "./hooks/hook";
import { BeatLoader } from "react-spinners";
import Dashboard from "./pages/Dashboard";
import AuthUser from "./pages/AuthUser";
import { RootState } from "./app/store";
import "./App.css";
const App = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.user);
  //! splash screen and redirect auth/login page if user doesn't exist
  useEffect(() => {
    if (!user.user) {
      setTimeout(() => {
        navigate("/auth/login");
      }, 5000);
    }
  }, [user.user, navigate]);
  return (
    <div className="flex items-center justify-center h-[100vh] flex-col">
      <Routes>
        {/* splash screen route */}
        <Route
          path="/"
          element={
            <div className="flex items-center flex-col">
              <h1 className="text-[#213547] text-[2rem] my-5">
                Diary App Loading
              </h1>
              <BeatLoader
                loading={!user.user}
                color="#63004F"
                speedMultiplier={0.4}
              />
            </div>
          }
        />
        {/* auth user route */}
        <Route path="/auth/login" element={<AuthUser />} />
        {/* protected route and dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
