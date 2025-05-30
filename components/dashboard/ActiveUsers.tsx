import { FC } from "react";

const ActiveUsers: FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Active Users</h2>
          <p className="text-sm text-gray-500">vs. previous month</p>
        </div>
        <div className="flex items-center">
          <span className="text-indigo-600 text-lg font-semibold">8.04%</span>
          <svg
            className="w-4 h-4 text-green-500 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      </div>

      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
        {/* Simple world map visualization */}
        <div className="absolute inset-0 opacity-50">
          <svg viewBox="0 0 1024 512" className="w-full h-full">
            <path
              d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h128v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"
              fill="currentColor"
              className="text-gray-300"
            />
          </svg>
        </div>

        {/* Active location dots */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Active Users</span>
          <span className="font-semibold">23,214</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
