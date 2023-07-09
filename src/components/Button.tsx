interface Props {
  textContent: string;
  styleProps: string;
}
const Button = ({ textContent, styleProps }: Props) => {
  return <button className={styleProps}>{textContent}</button>;
};

export default Button;
