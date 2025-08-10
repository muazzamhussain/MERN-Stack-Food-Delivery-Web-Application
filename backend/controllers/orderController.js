import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order from frontend
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.error("Order Error:", error.message);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// User's orders
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error getting users orders" });
  }
};

// List Order for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// updating order status
const updateStatus = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.deliveryStatus) {
      updateFields.deliveryStatus = req.body.deliveryStatus;
    }

    if (req.body.status) {
      updateFields.status = req.body.status;
    }

    const order = await orderModel.findByIdAndUpdate(
      req.body.orderId,
      updateFields,
      { new: true }
    );

    res.json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order" });
  }
};

const getOrderAnalytics = async (req, res) => {
  try {
    console.log("Fetching analytics...");
    
    // Get all orders first to see what we have
    const allOrders = await orderModel.find({});
    console.log("Total orders in DB:", allOrders.length);
    console.log("Order statuses:", allOrders.map(o => o.status));
    
    // Get accepted orders
    const orders = await orderModel.find({ status: "Accepted" });
    console.log("Accepted orders:", orders.length);

    const totalOrders = orders.length;

    const totalItems = orders.reduce((sum, order) => {
      return (
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      );
    }, 0);

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    const result = {
      totalOrders,
      totalItems,
      totalRevenue,
    };

    console.log("Analytics result:", result);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching analytics" });
  }
};

// Utility to subtract days/months/years from current date
const getStartDate = (range) => {
  const now = new Date();

  switch (range) {
    case "1d":
      now.setDate(now.getDate() - 1);
      break;
    case "3d":
      now.setDate(now.getDate() - 3);
      break;
    case "week":
      now.setDate(now.getDate() - 7);
      break;
    case "month":
      now.setMonth(now.getMonth() - 1);
      break;
    case "year":
      now.setFullYear(now.getFullYear() - 1);
      break;
    case "lifetime":
    default:
      return null;
  }

  return now;
};

// 📊 API: /api/order/chart-data?range=week
const getOrderChartData = async (req, res) => {
  try {
    const range = req.query.range || "week";
    console.log("Chart data request for range:", range);
    
    const startDate = getStartDate(range);
    console.log("Start date:", startDate);

    const filter = { status: "Accepted" };
    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }

    console.log("Filter:", filter);
    const orders = await orderModel.find(filter);
    console.log("Found orders for chart:", orders.length);

    // Group by date
    const chartMap = {};

    orders.forEach((order) => {
      // Use createdAt instead of order.createdAt for better date handling
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!chartMap[dateKey]) {
        chartMap[dateKey] = { orders: 0, items: 0, revenue: 0 };
      }

      chartMap[dateKey].orders += 1;
      chartMap[dateKey].revenue += order.amount;
      chartMap[dateKey].items += order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    });

    let chartData = Object.keys(chartMap).map((date) => ({
      date,
      ...chartMap[date],
    }));

    // Better date sorting
    chartData.sort((a, b) => {
      const dateA = new Date(a.date + ", " + new Date().getFullYear());
      const dateB = new Date(b.date + ", " + new Date().getFullYear());
      return dateA - dateB;
    });

    console.log("Chart data result:", chartData);

    res.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Chart Data Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching chart data" });
  }
};

export {
  placeOrder,
  userOrder,
  listOrders,
  updateStatus,
  getOrderAnalytics,
  getOrderChartData,
};