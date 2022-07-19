import { NextPage } from "next";
import { FaCommentSlash } from "react-icons/fa";
import { BsCameraVideoOffFill } from "react-icons/bs";

interface IProps {
  text: string;
}

const NoResults: NextPage<IProps> = ({ text }) => {
  return (
    <div className='flex flex-col justify-center items-center  h-full w-full'>
      <p className='text-5xl'>
        {text === "No comment yet" ? (
          <FaCommentSlash />
        ) : (
          <BsCameraVideoOffFill />
        )}
      </p>
      <p className='text-2xl text-center'>{text}</p>
    </div>
  );
};
export default NoResults;
