import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

// ChartJS에 필요한 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformanceChart({ data }: { data: ChartData<"bar"> }) {
  const options: ChartOptions<"bar"> = {
    scales: {
      x: {
        title: {
          display: true,
          text: "데이터크기",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "성능(Mbps)",
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "C API - loopback",
        font: {
          size: 16,
        },
      },
    },
  };
  return <Bar data={data} options={options} />;
}
