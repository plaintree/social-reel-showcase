import { time } from "console";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState, Dispatch, SetStateAction, FormEvent } from "react";
import { FaCommentSlash } from "react-icons/fa";

import { IUser } from "../types";
import useAuthStore from "../store/authStore";
import NoResults from "./NoResults";
import { MdVerified } from "react-icons/md";

interface IProps {
  isPostingComment: boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: FormEvent) => void;
  allComments: IComments[];
}

interface IComments {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref: string; _id: string };
}

const Comments: NextPage<IProps> = ({
  comment,
  addComment,
  setComment,
  allComments,
  isPostingComment,
}) => {
  const { userProfile, allUsers } = useAuthStore();
  return (
    <div className='border-t-2 border-gray-200 pt-4 px-10 bg-lime-50 border-b-2 lg:pb-0 pb-[100px]'>
      <div className='overflow-scroll lg:h-[475px]'>
        {allComments?.length ? (
          allComments.map((item, i) => (
            <>
              {allUsers.map(
                (user: IUser) =>
                  user._id === item.postedBy._id ||
                  (item.postedBy._ref && (
                    <div className='p-2 items-center' key={i}>
                      <Link href={`/profile/${user._id}`}>
                        <div className='flex items-start gap-3'>
                          <div className='w-8 h-8'>
                            <Image
                              src={user.image}
                              width={30}
                              height={30}
                              className='rounded-full'
                              alt='user profile'
                              layout='responsive'
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
                      <div className='d'>
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  ))
              )}
            </>
          ))
        ) : (
          <NoResults text='No comment yet' />
        )}
      </div>
      {userProfile && (
        <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-5'>
          <form onSubmit={addComment} className='flex gap-4'>
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Add comment'
              className='bg-white px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-gray-300 focus:border-2 flex-1 rounded-lg'
            />
            <button
              className='text-md text-white bg-lime-300 rounded-lg border-1 border-gray-100 px-1 md:px-6 py-none'
              onClick={addComment}>
              {isPostingComment ? "Commenting" : "Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Comments;
