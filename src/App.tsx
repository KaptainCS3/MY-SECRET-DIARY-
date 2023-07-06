import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectRoute from "./components/ProtectRoute";
import { useAppSelector } from "./hooks/hook";
import { BeatLoader } from "react-spinners";
import Dashboard from "./pages/Dashboard";
import AuthUser from "./pages/AuthUser";
import { RootState } from "./app/store";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
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
  console.log(user.user);

  return (
    <div className="flex items-center flex-col lg:w-full md:w-full">
      <Routes>
        {/* splash screen route */}
        <Route
          path="/"
          element={
            <div className="lg:w-full md:w-full">
              <Nav />
              <div className="flex items-center flex-col px-6">
                <h1 className="text-black font-bold text-2xl my-5">
                  Welcome to private diary
                </h1>
                <p className="text-center text-lg">
                  Create private entries, log your activities update records and
                  publish what you want the public to see
                </p>
                <button className="uppercase underline mt-16 outline-none mb-4">
                  get started
                </button>
                <BeatLoader
                  loading={!user.user}
                  color="#63004F"
                  speedMultiplier={0.4}
                />
              </div>
              <Footer />
            </div>
          }
        />
        {/* auth user route */}
        <Route
          path="/auth/login"
          element={
            <div className="lg:w-full md:w-full">
              <Nav />
              <div className="flex items-center flex-col px-6">
                <h1 className="text-black font-bold text-2xl my-5">
                  Welcome to private diary
                </h1>
                <p className="text-center text-lg">
                  Create private entries, log your activities update records and
                  publish what you want the public to see
                </p>
                <button className="uppercase underline mt-16 outline-none mb-4">
                  get started
                </button>
                {<AuthUser />}
              </div>
              <Footer />
            </div>
          }
        />
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
