import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../app/store";
import SuccessLogin from "./SuccessLogin";
//! define props pass from auth page using interface and setting types
interface Props {
  handleLogin: () => void;
  btnText: string;
  imgSrc: string;
}
const LoginBTN: React.FC<Props> = ({ handleLogin, btnText, imgSrc }) => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    //! conditional rendering display modal and confirm redirect or auth/login page
    user.user ? (
      <SuccessLogin />
    ) : (
      <div className="flex justify-center items-center my-3">
        <button
          onClick={handleLogin}
          className="outline-none lg:max-w-[350px] md:max-w-[350px] sm:max-w-[350px] w-full flex justify-between items-center border border-main py-2 rounded-xl px-4"
        >
          <span className="flex items-center">
            <img src={imgSrc} alt="image provider" />
            <span className="ml-2 text-[#4C4E4C] text-[1rem]">{btnText}</span>
          </span>
          <span className="bg-main px-3 py-[0.25rem] rounded-md text-white">
            <FontAwesomeIcon icon={faArrowRight} className="" />
          </span>
        </button>
      </div>
    )
  );
};
export default LoginBTN;
