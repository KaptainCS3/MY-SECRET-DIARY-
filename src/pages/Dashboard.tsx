import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SearchDiary from "../components/SearchDiary";
import Diary from "../components/Diary";
import Button from "../components/Button";
const Dashboard = () => {
  return (
    <div className="w-full relative">
      <Nav headerText="Home" />
      <div className="mx-6">
        <div className="-mt-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Welcome back</h2>
          <Button
            textContent="New entry"
            styleProps="bg-black text-white border px-4 py-2 rounded-md text-sm font-bold"
          />
        </div>
        <SearchDiary />
        <Diary />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
