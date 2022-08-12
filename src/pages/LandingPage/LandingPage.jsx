import { Button, Carousel } from 'antd';
import React from 'react'

import './LandingPage.css';
import girl from './assets/girl.png';
import mobile from './assets/mobile.png';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <div className='menubar'>
        <Link to="/sign_in">
          <Button type='link' className='link-button'>Sign In</Button>
        </Link>
        <Link to="/create_account">
          <Button size='large' className='action-button button-shadow'> Create Account</Button>
        </Link>
      </div>
      <Carousel autoplay={true} autoplaySpeed={3000} initialSlide={2} easing="cubic-bezier(0.075, 0.82, 0.165, 1)" speed={800}  pauseOnHover={false}>
        <div className='slides slide-1'>
          <div className="slide-wrapper">

            <img src={girl} alt="Girl"></img>
            <div className="textbox-1">
              <h1>Safe & Secure Emails</h1>
              <h2>Get all your filtered emails in your inbox </h2>

            </div>

          </div>
        </div>

        <div className='slides slide-2'>
          <div className="slide-wrapper">

            <div className="textbox-2">
              <h1>Connecting you with </h1>
              <h2>Get all your filtered emails in your inbox</h2>
            </div>

            <img src={mobile} alt="Mobile"></img>
            

          </div>
        </div>
      </Carousel>
    </div>
  )
}
