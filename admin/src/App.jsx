import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import Orders from "./pages/Orders/Orders";
import List from "./pages/List/List";
import { ToastContainer, toast } from "react-toastify";
import OrderRequest from "./pages/OrderRequest/OrderRequest";
import OrderAnalytics from "./pages/Analytics/OrderAnalytics";
import Edit from "./pages/Edit/Edit";

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/request" element={<OrderRequest url={url} />} />
          <Route path="/analytics" element={<OrderAnalytics url={url} />} />
          <Route path="/edit/:id" element={<Edit url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
