import { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import { useRouter } from "next/router";
import axios from "axios";

import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";
import useAuthStore from "../../store/authStore";

interface IProps {
  videos: Video[];
}

const Queries: NextPage<IProps> = ({ videos }) => {
  const [isAccount, setIsAccount] = useState(false);
  const router = useRouter();
  const { query }: any = router.query;
  const { allUsers } = useAuthStore();

  const searchedAccount = allUsers.filter((user: IUser) =>
    user.userName.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );

  const accountStyle = isAccount ? "border-b-2 border-black" : "text-gray-400";
  const videoStyle = !isAccount ? "border-b-2 border-black" : "text-gray-400";

  return (
    <div className='w-full'>
      <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${accountStyle}`}
          onClick={() => setIsAccount(true)}>
          Accounts
        </p>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${videoStyle}`}
          onClick={() => setIsAccount(false)}>
          Videos
        </p>
      </div>
      {isAccount ? (
        <div className='md:mt-16'>
          {searchedAccount.length ? (
            searchedAccount.map((user: IUser, i) => (
              <Link href={`/profile/${user._id}`} key={i}>
                <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                  <div className='w-8 h-8'>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className='rounded-full'
                      alt='user profile'
                    />
                  </div>
                  <div>
                    <p className='flex gap-1 items-center text-md font-bold text-black lowercase'>
                      {user.userName.replaceAll(" ", "")}
                      <MdVerified className='text-blue-400' />
                    </p>
                    <p className='capitalize text-gray-400 text-xs'>
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`Couldn't find any accounts for ${query}`} />
          )}
        </div>
      ) : (
        <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
          {videos?.length ? (
            videos.map((video: Video, i) => <VideoCard post={video} key={i} />)
          ) : (
            <NoResults text={`No video for ${query}`} />
          )}
        </div>
      )}
    </div>
  );
};
export default Queries;

export const getServerSideProps = async ({
  params: { query },
}: {
  params: { query: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/search/${query}`);

  return {
    props: {
      videos: data,
    },
  };
};
