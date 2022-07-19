import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { RiVideoUploadLine } from "react-icons/ri";

import Logo from "../utils/socialReel-logos_black.png";
import { createOrGetUser } from "../utils";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const [searchField, setSearchField] = useState("");
  const { userProfile, addUser, removeUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchField) {
      router.push(`/search/${searchField}`);
    }
    setSearchField("");
  };
  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
      <Link href='/'>
        <div className='w-[150px] md:w-[200px] '>
          <Image className='cursor-pointer' src={Logo} alt='Social Reel' />
        </div>
      </Link>
      <div className='relative hidden md:block'>
        <form
          onSubmit={handleSubmit}
          className='absolute md:static top-10 left-20 bg-white'>
          <input
            type='text'
            className='bg-white p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0'
            placeholder='Search accounts and videos...'
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-xl text-gray-400'>
            <BiSearch />
          </button>
        </form>
      </div>
      <div>
        {userProfile ? (
          <div className='flex gap-5 md:gap-10'>
            <Link href='/upload'>
              <button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 rounded-full hover:bg-lime-300 hover:text-white'>
                <RiVideoUploadLine className='text-xl' />{" "}
              </button>
            </Link>
            {userProfile.image && (
              <Link href='/'>
                <a>
                  <Image
                    src={userProfile.image}
                    width={40}
                    height={40}
                    objectFit='cover'
                    className='rounded-full cursor-pointer'
                    alt='profile-picture'
                  />
                </a>
              </Link>
            )}
            <button
              type='button'
              className='text-lime-500 flex items-center gap-2'
              onClick={() => {
                googleLogout();
                removeUser();
              }}>
              <span className='text-sm'>Logout</span>
              <BiLogOut className=' text-xl' />
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(res) => createOrGetUser(res, addUser)}
            onError={() => console.log(`Error`)}
          />
        )}
      </div>
    </div>
  );
};
export default Navbar;
