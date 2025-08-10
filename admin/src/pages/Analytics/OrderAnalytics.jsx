import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./orderAnalytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderAnalytics = ({ url }) => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalItems: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("week"); // Default range

  const fetchAnalytics = async () => {
    try {
      console.log("Fetching analytics from:", `${url}/api/order/analytics`);
      const response = await axios.get(`${url}/api/order/analytics`);
      console.log("Analytics response:", response.data);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchChartData = async (selectedRange) => {
    try {
      setLoading(true);
      console.log("Fetching chart data for:", selectedRange);
      const response = await axios.get(
        `${url}/api/order/chart-data?range=${selectedRange}`
      );
      console.log("Chart data response:", response.data);
      if (response.data.success) {
        setChartData(response.data.data);
      }
    } catch (error) {
      console.error("Chart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS: Fetch analytics on component mount
  useEffect(() => {
    fetchAnalytics();
  }, [url]);

  useEffect(() => {
    console.log("Range changed to:", range);
    fetchChartData(range);
  }, [range, url]); // Add url dependency

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Order Trends (${range})`,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const chartDataFormatted = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Orders",
        data: chartData.map((item) => item.orders),
        borderColor: "rgb(75, 192, 192)", // orange
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(75, 192, 192)",
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Revenue ($)",
        data: chartData.map((item) => item.revenue),
        borderColor: "rgb(255, 159, 64)", // teal
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(255, 159, 64)",
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Items Sold",
        data: chartData.map((item) => item.items),
        borderColor: "rgb(153, 102, 255)", // purple
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(153, 102, 255)",
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <div className="header">
        <h2>Order Analytics</h2>
        <select
          id="range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="1d">1 Day</option>
          <option value="3d">3 Days</option>
          <option value="week">7 Days</option>
          <option value="month">1 Month</option>
          <option value="year">1 Year</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="analytics-number">{analytics.totalOrders}</p>
        </div>
        <div className="analytics-card">
          <h3>Total Food Items Sold</h3>
          <p className="analytics-number">{analytics.totalItems}</p>
        </div>
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="analytics-number">
            ${analytics.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="loading">Loading chart data...</div>
        ) : chartData.length > 0 ? (
          <Line data={chartDataFormatted} options={chartOptions} />
        ) : (
          <div className="no-data">
            No data available for the selected range
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderAnalytics;
