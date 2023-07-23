import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hook";
import { RootState } from "../app/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { logoutAll } from "../features/UserSlice";
import Button from "./Button";
interface Props {
  headerText: string;
}
const Nav: React.FC<Props> = ({ headerText }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
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
  // show logout button
  const showBtn = () => {
    setIsShow(!isShow);
  };

  const dispatch = useAppDispatch();
  const signOut = () => {
    dispatch(logoutAll());
  };
  return (
    <div className="bg-black w-full py-4 mb-10">
      <nav className="flex w-full items-center px-6 justify-between">
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="logo" />
          <h1 className="text-[1.7rem] text-white pl-10 sm:text-xl">
            {headerText}
          </h1>
        </div>
        <span className="text-white text-xl rounded-full border h-8 w-8 flex items-center justify-center">
          {user.user ? (
            <span className="container">
              <img
                src={photoURL}
                alt={displayName}
                className="w-full h-full rounded-full image"
                referrerPolicy="no-referrer"
                onClick={showBtn}
              />
              {isShow && (
                <>
                <Button
                  textContent="Logout"
                  styleProps="text-sm tooltiptext isvisible"
                  type="button"
                  actionBtn={signOut}
                />
                <p></p>
              </>
              )}
            </span>
          ) : (
            <FontAwesomeIcon icon={faUser} className="" />
          )}
        </span>
      </nav>
    </div>
  );
};

export default Nav;
