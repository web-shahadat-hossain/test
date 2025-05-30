import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesOverview: FC = () => {
  const data = {
    datasets: [
      {
        data: [500, 235],
        backgroundColor: ["rgb(99, 102, 241)", "rgb(45, 212, 191)"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="sr-only">More options</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      <div className="relative h-64">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">$500.00</p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
          <span className="text-sm font-medium">$23,450</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
            <span className="text-sm text-gray-600">Expense</span>
          </div>
          <span className="text-sm font-medium">$23,450</span>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
