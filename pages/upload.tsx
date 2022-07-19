import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdDeleteOutline, MdOutlineCloudUpload } from "react-icons/md";
import axios from "axios";
import { SanityAssetDocument } from "@sanity/client";

import useAuthStore from "../store/authStore";
import { client } from "../utils/client";
import { topics } from "../utils/constants";
import { BASE_URL } from "../utils";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongFileType, setWrongFileType] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);
  const { userProfile }: { userProfile: any } = useAuthStore();
  const router = useRouter();
  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setVideoAsset(document);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  const handlePost = async () => {
    if (caption && category && videoAsset?._id) {
      setSavingPost(true);
      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      };
      await axios.post(`${BASE_URL}/api/posts`, document);
      router.push("/");
    }
  };

  const handleDiscard = () => {
    setSavingPost(false);
    setVideoAsset(undefined);
    setCaption("");
    setCategory("");
  };

  return (
    <div className='flex mb-5 lg:pt-3 justify-start bg-lime-50'>
      <div className='rounded-lg flex flex-wrap gap-5 justify-between items-center p-4 bg-lime-50'>
        <div>
          <div>
            <p className='text-2xl font-bold'>Upload video</p>
            <p className='text-md text-gray-400 mt-1'>
              Post a video to your account
            </p>
          </div>
          <div>
            <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[400px] p-10 cursor-pointer hover:border-lime-400 hover:bg-lime-200'>
              {isLoading ? (
                <p>Uploading...</p>
              ) : (
                <div>
                  {videoAsset ? (
                    <div>
                      <video
                        src={videoAsset.url}
                        loop
                        controls
                        className='rounded-xl h-[450px] mt-16 bg-black'></video>
                    </div>
                  ) : (
                    <label className='cursor-pointer'>
                      <div className='flex flex-col items-center justify-center h-full'>
                        <div className='flex flex-col items-center justify-center'>
                          <p className='font-bold text-xl'>
                            <MdOutlineCloudUpload className='text-gray-300 text-5xl' />
                          </p>
                          <p className='text-xl font-semibold'>Upload Video</p>
                        </div>
                        <p className='text-gray-400 text-center mt-5 text-sm leading-8'>
                          Format: mp4, webm, ogg <br />
                          360p or higher (Up to 10mins) <br />
                          Less than 500MB
                        </p>
                        <p className='bg-lime-300 mt-8 text-center text-white text-md font-medium p-2 w-52 outline-none'>
                          Select File
                        </p>
                      </div>
                      <input
                        type='file'
                        name='upload-video'
                        onChange={uploadVideo}
                        className='w-0 h-0'
                      />
                    </label>
                  )}
                </div>
              )}
              {wrongFileType && (
                <p className='text-center text-xl text-lime-600 font-semibold mt-4 w-[250px]'>
                  Please select a video file
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3 pb-10'>
          <label htmlFor='caption' className='text-md font-medium'>
            Caption
          </label>
          <input
            id='caption'
            type='text'
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            className='rounded text-md border-2 outline-none border-gray-200 p-2'
          />
          <label className='text-md font-medium'>Choose a category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className='outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'>
            {topics.map((topic, i) => (
              <option value={topic.name.toLocaleLowerCase()} key={i}>
                {topic.name}
              </option>
            ))}
          </select>
          <div className='flex gap-6 mt-10'>
            <button
              type='button'
              className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
              onClick={handleDiscard}>
              Discard
            </button>
            <button
              type='button'
              className='bg-lime-300 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
              onClick={handlePost}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Upload;
