import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const YearlySales: FC = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "2023",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 95, 90, 100],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "2022",
        data: [20, 35, 40, 45, 40, 50, 60, 80, 110, 85, 80, 90],
        borderColor: "rgb(45, 212, 191)",
        backgroundColor: "rgba(45, 212, 191, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          maxTicksLimit: 5,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Yearly Sales</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <span className="text-indigo-600 font-medium">$5,476</span>
            <span className="text-gray-500 ml-1">2023</span>
          </div>
          <div className="text-sm">
            <span className="text-teal-500 font-medium">$4,476</span>
            <span className="text-gray-500 ml-1">2022</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default YearlySales;
