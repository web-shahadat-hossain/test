"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const CreateNews = () => {
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");

  // ✅ TypeScript fixed: added correct type
  const imageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setImg(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">Create Blog</h2>
        <Link
          className="px-3 py-[6px] bg-orange-500 rounded-sm text-white hover:bg-orange-600"
          href="/blog/all"
        >
          All Blogs
        </Link>
      </div>

      <div className="p-4">
        <form>
          {/* Title */}
          <div className="flex flex-col mb-6 gap-y-2">
            <label
              className="font-medium text-gray-600 text-md"
              htmlFor="title"
            >
              Title
            </label>
            <input
              required
              type="text"
              placeholder="title"
              name="title"
              className="h-10 px-3 py-2 border border-gray-300 rounded-md outline-0 focus:border-orange-500"
              id="title"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col mb-6 gap-y-2">
            <label
              className="font-medium text-gray-600 text-md"
              htmlFor="category"
            >
              Select Category
            </label>
            <select
              required
              name="category"
              id="category"
              className="h-10 px-3 py-2 border border-gray-300 rounded-md outline-0 focus:border-orange-500"
            >
              <option value="">---select category---</option>
              <option value="বাংলাদেশ">বাংলাদেশ</option>
              <option value="জাতীয়">জাতীয়</option>
              <option value="রাজনীতি">রাজনীতি</option>
              <option value="বিনোদন">বিনোদন</option>
              <option value="অর্থনীতি">অর্থনীতি</option>
              <option value="খেলা">খেলা</option>
              <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
              <option value="লাইফস্টাইল">লাইফস্টাইল</option>
              <option value="বিজ্ঞান ও প্রযুক্তি">বিজ্ঞান ও প্রযুক্তি</option>
              <option value="স্বাস্থ্য">স্বাস্থ্য</option>
              <option value="ধর্ম">ধর্ম</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <div>
              <label
                htmlFor="img"
                className="w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed"
              >
                {img ? (
                  <img src={img} className="w-full h-full" alt="image" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-y-2">
                    <span className="text-2xl">
                      <MdCloudUpload />
                    </span>
                    <span>Select Image</span>
                  </div>
                )}
              </label>
              <input
                onChange={imageHandle}
                required
                className="hidden"
                type="file"
                id="img"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mb-6 gap-y-2">
            <div className="flex items-center justify-start gap-x-2">
              <h2>Description</h2>
            </div>
            <div>
              <JoditEditor
                ref={editor}
                value={description}
                tabIndex={1}
                onBlur={(value) => setDescription(value)}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="px-3 py-[6px] bg-orange-500 rounded-sm text-white hover:bg-orange-600"
            >
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
