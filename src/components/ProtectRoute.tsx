import { ReactNode, ComponentType } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../app/store";

type Props = {
  children?: ReactNode;
  component: ComponentType<object>;
};

const ProtectRoute = ({ component: Component, children }: Props) => {
  const user = useAppSelector((state: RootState) => state.user);

  if (!user.user) {
    return <Navigate to="/" />;
  }
  //! render protected component
  return <Component>{children}</Component>;
};

export default ProtectRoute;
