interface Props {
  textContent: string;
  styleProps: string;
  type: "button" | "submit" | "reset";
  actionBtn: () => void
}
const Button = ({ textContent, styleProps, type, actionBtn }: Props) => {
  return (
    <button
      onClick={actionBtn}
      type={type}
      className={`bg-black text-white  ${styleProps}`}
    >
      {textContent}
    </button>
  );
};

export default Button;
