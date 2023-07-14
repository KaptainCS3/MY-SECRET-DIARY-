interface Props {
  error_value: string | string[];
}
const ErrorMSG = ({ error_value }: Props) => {
  if (!error_value) return null;
  const errors = Array.isArray(error_value) ? error_value : [error_value];
  return (
    <div className="text-isPublic pt-3">
      {errors.map((errorMsg) => (
        <p key={errorMsg}>{errorMsg}</p>
      ))}
    </div>
  );
};

export default ErrorMSG;
