import Image from "next/image";
import Link from "next/link";

const RecentBlog = () => {
  return (
    <div className="w-full flex flex-col gap-y-[14px] bg-white pt-4">
      <div className="pl-4">Recent news</div>
      <div className="grid grid-cols-1 gap-y-3">
        <div className="bg-white shadow flex p-4">
          <div className="relative group overflow-hidden h-full">
            <div className="group-hover:scale-[1.1] transition-all duration-[1s] w-[100px] md:w-[160px] h-[93px] lg:w-[100px] relative">
              <Image
                className=""
                layout="fill"
                src={
                  "https://res.cloudinary.com/dpcxwe6gm/image/upload/v1748547958/blog-1_gcen8i.webp"
                }
                alt="images"
              />
              <div className="w-full h-full block absolute left-0 top-0 invisible group-hover:visible bg-white cursor-pointer opacity-5 transition-all duration-300"></div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 w-[calc(100%-100px)] md:w-[calc(100%-160px)] lg:w-[calc(100%-100px)] pl-3">
            <Link href={`#`} className="text-sm font-semibold text-[orange]">
              ATA CATEGORY
            </Link>
            <Link
              href={`#`}
              className="text-sm font-semibold text-[#333333] hover:text-[#FF6C19]"
            >
              Hassle-Free Process
            </Link>
            <div className="flex gap-x-2 text-xs font-normal text-slate-600">
              <span>May 30, 2025, 2:45 PM</span>
              {/* <span>{item?.writerName}</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;
