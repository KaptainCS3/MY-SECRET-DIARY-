import React from "react";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../app/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
interface Props {
  headerText: string;
}
const Nav: React.FC<Props> = ({ headerText }) => {
  const user = useAppSelector((state: RootState) => state.user) as {
    user: {
      displayName: string | null;
      photoURL: string | null;
    };
  };

  //! destructure user details and assign types to object properties
  const { displayName, photoURL } = user.user
    ? {
        displayName: user.user.displayName || "",
        photoURL: user.user.photoURL || "",
      }
    : {
        displayName: "",
        photoURL: "",
      };
  return (
    <div className="bg-black w-full py-4 mb-10">
      <nav className="flex w-full items-center px-6 justify-between">
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="logo" />
          <h1 className="text-[1.7rem] text-white pl-16 sm:text-xl">
            {headerText}
          </h1>
        </div>
        <span className="text-white text-xl rounded-full border h-8 w-8 flex items-center justify-center">
          {user.user ? (
            <img
              src={photoURL}
              alt={displayName}
              className="w-full h-full rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="" />
          )}
        </span>
      </nav>
    </div>
  );
};

export default Nav;
