//! define props pass from auth page using interface and setting types
interface Props {
  handleLogin: () => void;
  btnText: string;  
}
const LoginBTN: React.FC<Props> = ({ handleLogin, btnText }) => {
  return (
    //! conditional rendering display modal and confirm redirect or auth/login
    <div className="flex justify-center items-center my-3">
      <button
        onClick={handleLogin}
        className="py-3 outline-none lg:max-w-[350px] md:max-w-[350px] sm:max-w-[350px] w-full flex justify-center items-center border rounded-xl px-4 bg-black text-white"
      >
        <span className="flex items-center">
          <span className="ml-2 text-[1rem]">{btnText}</span>
        </span>
      </button>
    </div>
  );
};
export default LoginBTN;
