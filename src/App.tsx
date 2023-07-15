import ProtectRoute from "./components/ProtectRoute";
import { useAppSelector, useAppDispatch } from "../src/hooks/hook";
import { RootState } from "../src/app/store";
import DiaryEntry from "./pages/DiaryEntry";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Home from "./pages/Home";
import { auth } from "./utils/firebase";
import { useEffect } from "react";
import { setUser } from "./features/UserSlice";

const App = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  //! render user store in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(setUser(user));
    }
  }, [dispatch]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        //! store data in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
      } else {
        localStorage.removeItem("user");
        dispatch(setUser(null));
      }
    });
  }, [dispatch]);

  console.log(user);
  return (
    <div className="flex items-center flex-col lg:w-full md:w-full">
      <Routes>
        {/* user home page */}
        <Route path="/" element={<Home />} />
        {/* protected route and dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectRoute component={Dashboard} />}
        />
        {/* protected route and DiaryEntry */}
        <Route
          path="/journal/create"
          element={<ProtectRoute component={DiaryEntry} />}
        />
      </Routes>
    </div>
  );
};

export default App;
