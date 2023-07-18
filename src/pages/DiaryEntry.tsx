import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormEntry from "../components/FormEntry";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
const DiaryEntry = () => {
  const navigate = useNavigate();
  const closeEntry = () => {
    navigate("/journals");
  };
  return (
    <div className="w-full">
      <Nav headerText="New entry" />
      <div className="mx-6 pb-8">
        <div className="-mt-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create a new diary</h2>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={closeEntry}
            className="cursor-pointer text-2xl"
          />
        </div>
        <FormEntry />
      </div>
      <Footer />
    </div>
  );
};

export default DiaryEntry;
