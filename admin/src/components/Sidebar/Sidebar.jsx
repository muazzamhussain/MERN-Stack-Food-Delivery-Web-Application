import React from 'react'
import './sidebar.css'
import { assets } from '../../assets/admin_assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.list} alt="" width="35px" />
            <p>List Items </p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders </p>
        </NavLink>
        <NavLink to='/request' className="sidebar-option">
            <img src={assets.new_order_icon} alt="" width="30px" />
            <p>New Orders </p>
        </NavLink>
        <NavLink to='/analytics' className="sidebar-option">
            <img src={assets.analytics_icon} alt="" width="30px" />
            <p>Analytics </p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
