import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { HiMenu, HiOutlineHome } from "react-icons/hi";
import { GiCancel } from "react-icons/gi";

import Discover from "./Discover";
import Footer from "./Footer";
import SuggestedAccounts from "./SuggestedAccounts";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-lime-500 rounded";

  return (
    <div>
      <div
        className='block xl:hidden m-2 ml-4 mt-3 text-xl'
        onClick={() => setShowSidebar((prevState) => !prevState)}>
        {showSidebar ? <GiCancel /> : <HiMenu />}
      </div>
      {showSidebar && (
        <div className='w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3 xl:w-72'>
          <div className='xl:border-b-2 border-gray-200 xl:pb-4 '>
            <Link href='/'>
              <div className={normalLink}>
                <p className='text-2xl'>
                  <HiOutlineHome />
                </p>
                <span className='hidden xl:block text-xl capitalize'>
                  Just For You
                </span>
              </div>
            </Link>
          </div>
          <Discover />
          <SuggestedAccounts />
          <Footer />
        </div>
      )}
    </div>
  );
};
export default Sidebar;
