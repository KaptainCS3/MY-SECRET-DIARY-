import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BeatLoader } from "react-spinners";
interface Props {
  textContent: string;
  styleProps: string;
  type: "button" | "submit" | "reset";
  actionBtn?: () => void;
  disabled?: boolean;
}
const Button = ({
  textContent,
  styleProps,
  type,
  actionBtn,
  disabled,
}: Props) => {
  if (disabled === undefined) {
    disabled = false;
  }

  return (
    <button
      onClick={actionBtn}
      type={type}
      disabled={disabled}
      className={`${styleProps}`}
    >
      {/* conditional render form submit display */}
      {disabled && (textContent === "Save" || textContent === "Filter") ? (
        <BeatLoader color="#fff" speedMultiplier={0.6} />
      ) : (
        textContent
      )}

      {/* conditional render delete diary */}
      {disabled && textContent === "" ? (
        <BeatLoader color="#F24E1E" speedMultiplier={0.6} />
      ) : null}
      {textContent === "Logout" ? (
        <FontAwesomeIcon icon={faSignOut} className="pl-2" />
      ) : null}
    </button>
  );
};

export default Button;
