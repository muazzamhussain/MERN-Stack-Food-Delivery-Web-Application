import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrder,
  getOrderAnalytics,
  getOrderChartData,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrder);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/analytics", getOrderAnalytics); 
orderRouter.get("/chart-data", getOrderChartData);

export default orderRouter;