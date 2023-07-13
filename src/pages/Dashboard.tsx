import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SearchDiary from "../components/SearchDiary";
import Diary from "../components/Diary";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { ToastContainer } from "react-toastify";
const Dashboard = () => {
  const navigate = useNavigate();
  const newEntry = () => {
    navigate("/new-entry");
  };
  return (
    <div className="w-full">
      <Nav headerText="Home" />
      <div className="mx-6 mb-14">
        <div className="-mt-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Welcome back</h2>
          <Button
            actionBtn={newEntry}
            styleProps="border px-4 py-2 rounded-md text-sm font-bold"
            textContent="New entry"
            type="button"
          />
        </div>
        <SearchDiary />
        <Diary />
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Dashboard;
