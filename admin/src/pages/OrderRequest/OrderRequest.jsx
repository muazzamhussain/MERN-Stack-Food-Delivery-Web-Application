import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";
import "./orderRequest.css";

const OrderRequests = ({ url }) => {
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const filtered = response.data.data.filter(
          (order) => order.status === "Pending"
        );
        setPendingOrders(filtered);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const handleAction = async (orderId, newStatus) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Order ${newStatus}`);
        fetchPendingOrders(); // Refresh list
      } else {
        toast.error("Action failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Pending Order Requests</h3>
      <div className="order-list">
        {pendingOrders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          pendingOrders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel" />
              <div>
                <p className="order-item-food">
                  {order.items
                    .map((item) => `${item.name}x${item.quantity}`)
                    .join(", ")}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>Total: ${order.amount}</p>
              <div className="order-actions">
                <button
                  onClick={() => handleAction(order._id, "Accepted")}
                  className="accept"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(order._id, "Rejected")}
                  className="reject"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderRequests;
