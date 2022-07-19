import { useState, useEffect } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { NextPage } from "next";

import useAuthStore from "../store/authStore";

interface IProps {
  handleLike: () => void;
  handleDislike: () => void;
  likes: any[];
}

const LikeButton: NextPage<IProps> = ({ handleDislike, handleLike, likes }) => {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const { userProfile }: any = useAuthStore();
  const filterLikes = likes?.filter((like) => like._ref === userProfile?._id);
  useEffect(() => {
    if (filterLikes?.length > 0) {
      setAlreadyLiked(true);
    } else {
      setAlreadyLiked(false);
    }
  }, [likes, filterLikes]);

  return (
    <div className='gap-6 flex'>
      <div className='mt-4 flex flex-col justify-center items-center cursor-pointer'>
        {alreadyLiked ? (
          <div
            className='bg-lime-100 rounded-full p-2 md:p-4 text-rose-500'
            onClick={handleDislike}>
            <MdOutlineFavorite className='text-lg md:text-2xl' />
          </div>
        ) : (
          <div
            className='bg-lime-100 rounded-full p-2 md:p-4'
            onClick={handleLike}>
            <MdOutlineFavorite className='text-lg md:text-2xl' />
          </div>
        )}
        <p className='text-md font-semibold'>{likes?.length | 0}</p>
      </div>
    </div>
  );
};
export default LikeButton;
