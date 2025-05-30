import React from "react";
import { FaUserCircle } from "react-icons/fa";
import RecentBlog from "./RecentBlog";

const Details = async () => {
  return (
    <div className="pt-[140px]">
      <div className="mt-14 lg:mt-0">
        <div className="bg-slate-100 w-full ">
          <div className="max-w-[1350px] mx-auto">
            <div className="px-4 md:px-8 w-full py-8">
              <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12">
                  <div className="w-full pr-0 xl:pr-4">
                    <div className="flex flex-col gap-y-5 bg-white">
                      <div className="px-6 pt-4 flex flex-col gap-y-4">
                        <h3 className="text-[#FF6C19] uppercase font-medium text-xl">
                          ATA CATEGORY
                        </h3>
                        <h2 className="text-3xl text-gray-700 font-bold">
                          Access to US products
                        </h2>

                        <div className="flex flex-col gap-x-2 text-xs font-normal text-slate-600">
                          <span>Published: May 30, 2025, 2:45 PM</span>

                          <span className="flex gap-2 items-center">
                            {" "}
                            <FaUserCircle /> Md Faisal
                          </span>
                        </div>
                      </div>
                      <div>
                        <img
                          src="https://res.cloudinary.com/dpcxwe6gm/image/upload/v1748547958/blog-1_gcen8i.webp"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-y-4 px-6 pb-6">
                        <p>
                          Simply paste the product link, and we'll take care of
                          the approval, shipping, and delivery process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-4/12">
                  <div className="w-full pl-0 xl:pl-4">
                    <div className="flex flex-col gap-y-8">
                      <RecentBlog />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
