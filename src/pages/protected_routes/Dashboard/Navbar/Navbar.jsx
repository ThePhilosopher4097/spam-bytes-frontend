import React from 'react'
import "./Navbar.css"

import logo from "./assets/logo.png";
import profile_btn_icon from "./assets/profile-btn-icon.png";
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';

const Navbar = () => {

    return (
    <div className='navbar-wrapper'>
        <img src={logo} alt="Logo" className='logo' />
        <div>
            <div className="icon-btns-container">
                <SearchOutlined className='navbar-btn' />
                <SettingOutlined className='navbar-btn' />
            </div>
            <div className="profile-btn-container">
                <img src={profile_btn_icon} alt="Profile" className='profile-btn-icon' />
                <span>Anushka Yadav</span>
            </div>
        </div>
    </div>
    )
}

export default Navbar;