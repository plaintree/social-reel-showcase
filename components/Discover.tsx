import { link } from "fs/promises";
import Link from "next/link";
import { useRouter } from "next/router";
import { topics } from "../utils/constants";

const Discover = () => {
  const router = useRouter();
  const { topic } = router.query;

  const topicStyle =
    "xl:border-2 hover:bg-lime-300 hover:text-white xl:border-gray-300 px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-black";

  const activeTopicStyle =
    "xl:border-2 hover:bg-white xl:border-lime-300 px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-lime-500";
  return (
    <div className='xl:border-b-2 xl:border-gray-200 pb-6'>
      <p className='text-gray-500 font-semibold m-3 mt-4 hidden xl:block'>
        Popular Topics
      </p>
      <div className='flex gap-3 flex-wrap'>
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={topic === item.name ? activeTopicStyle : topicStyle}>
              <span className='font-bold text-2xl xl:text-md'>{item.icon}</span>
              <span className='font-medium text-md hidden xl:block capitalize'>
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Discover;
