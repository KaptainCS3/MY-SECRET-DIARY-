interface Props {
  error_value: string;
}
const ErrorMSG = ({ error_value }: Props) => {

  return <div className="text-isPublic pt-3">{error_value}</div>;
};

export default ErrorMSG;
