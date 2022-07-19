import { NextPage } from "next";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import axios from "axios";

import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const Profile: NextPage<IProps> = ({ data }) => {
  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const { user, userVideos, userLikedVideos } = data;
  const videoStyle = showUserVideos
    ? "border-b-2 border-black"
    : "text-gray-400";
  const likedStyle = !showUserVideos
    ? "border-b-2 border-black"
    : "text-gray-400";

  useEffect(() => {
    if (showUserVideos) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideos, userLikedVideos, userVideos]);
  return (
    <div className='w-full'>
      <div className='flex items-start gap-6 md:gap-10 mb-4 bg-white w-full items-center'>
        <div className='w-16 h-16 md:w-32 md:h-32'>
          <Image
            src={user.image}
            width={80}
            height={80}
            className='rounded-full'
            alt='user profile'
            layout='responsive'
          />
        </div>
        <div className='flex flex-col'>
          <p className='flex gap-1 items-center justify-center text-md font-bold text-black md:text-2xl tracking-wide lowercase'>
            {user.userName.replaceAll(" ", "")}
            <MdVerified className='text-blue-400' />
          </p>
          <p className='capitalize text-gray-400 text-xs md:text-xl'>
            {user.userName}
          </p>
        </div>
      </div>
      <div>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videoStyle}`}
            onClick={() => setShowUserVideos(true)}>
            Video
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${likedStyle}`}
            onClick={() => setShowUserVideos(false)}>
            Liked
          </p>
        </div>

        <div className='flex gap-6 flex-wrap md:justify-start'>
          {videoList.length ? (
            videoList.map((post: Video, i: number) => (
              <VideoCard post={post} key={i} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? "" : "Liked"} Videos yet`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/profile/${id}`);

  return {
    props: {
      data,
    },
  };
};
