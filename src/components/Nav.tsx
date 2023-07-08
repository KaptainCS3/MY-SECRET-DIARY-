import React from "react";

interface Props{
  headerText: string;
}
const Nav: React.FC<Props> = ({headerText}) => {
  return (
    <div className="bg-black w-full py-4 mb-10">
      <nav className="flex w-full items-center px-6">
        <img src="/assets/logo.png" alt="logo" />
        <h1 className="text-[1.7rem] text-white pl-16 sm:text-xl">
          {headerText}
        </h1>
      </nav>
    </div>
  );
};

export default Nav;
