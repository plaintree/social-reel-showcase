import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  BsFillVolumeUpFill,
  BsFillVolumeOffFill,
  BsPlay,
  BsPause,
} from "react-icons/bs";
import { MdOutlineCancel, MdVerified } from "react-icons/md";
import axios from "axios";

import { BASE_URL } from "../../utils";
import { Video } from "../../types";
import useAuthStore from "../../store/authStore";
import LikeButton from "../../components/LikeButton";
import Comments from "../../components/Comments";

interface IProps {
  postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();

  useEffect(() => {
    if (videoRef?.current && post) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted, post]);

  if (!post) return null;

  const handleVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (userProfile && comment) {
      setIsPostingComment(true);
      const { data } = await axios.put(`${BASE_URL}/api/posts/${post._id}`, {
        userId: userProfile._id,
        comment,
      });
      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[900px] lg:w-9/12 flex justify-center items-center bg-black'>
        <div className='absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer' onClick={() => router.back()}>
            <MdOutlineCancel className='text-white text-lg' />
          </p>
        </div>
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
            <video
              src={post.video.asset.url}
              className='h-full cursor-pointer'
              ref={videoRef}
              onClick={handleVideoClick}
              loop
            />
          </div>
          <div className='absolute inset-1/2 cursor-pointer'>
            {!playing ? (
              <button onClick={handleVideoClick}>
                <BsPlay className='text-white text-3xl lg:text-6xl' />
              </button>
            ) : (
              <button onClick={handleVideoClick}>
                <BsPause className='text-white text-3xl lg:text-6xl invisible' />
              </button>
            )}
          </div>
        </div>
        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
          {!isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(true)}>
              <BsFillVolumeUpFill className='text-white text-2xl lg:text-4xl' />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(false)}>
              <BsFillVolumeOffFill className='text-white text-2xl lg:text-4xl' />
            </button>
          )}
        </div>
      </div>
      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div className='lg:mt-20 mt-10'>
          <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
            <div className='md:w-20 md:h-20 w-16 h-16 ml-4'>
              <Link href='/'>
                <a>
                  <Image
                    src={post?.postedBy?.image}
                    width={60}
                    height={60}
                    objectFit='cover'
                    className='rounded-full'
                    alt='profile-picture'
                    layout='responsive'
                  />
                </a>
              </Link>
            </div>
            <Link href='/'>
              <div className='flex flex-col mt-3 gap-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {post.postedBy.userName.replaceAll(" ", "")}{" "}
                  <MdVerified className='text-blue-400 text-md' />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 '>
                  {post.postedBy.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
        <p className='px-10 text-lg text-gray-600'>{post.caption}</p>
        <div className='mt-10 px-10'>
          {userProfile && (
            <LikeButton
              handleLike={() => handleLike(true)}
              handleDislike={() => handleLike(false)}
              likes={post.likes}
            />
          )}
        </div>
        <Comments
          comment={comment}
          setComment={setComment}
          addComment={addComment}
          isPostingComment={isPostingComment}
          allComments={post.comments}
        />
      </div>
    </div>
  );
};
export default Detail;

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/posts/${id}`);
  return {
    props: {
      postDetails: data,
    }, // will be passed to the page component as props
  };
};
