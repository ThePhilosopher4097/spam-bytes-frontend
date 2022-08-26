import { Button, Layout } from 'antd';
import React, { Component } from 'react';
import Navbar from './Navbar/Navbar';
import "./Redirect.css"

import redirect_illus from "./assets/redirect_illustration.png"
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { useState } from 'react';

const lookup = require('safe-browse-url-lookup')({ apiKey: 'AIzaSyBnHGGlB8LLe7VzBvyoQGKUy7kjatk3Ej8' });

const Redirect = () => {
    
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState("Checking Link...");

    useEffect(() => {
        
      if(!searchParams.get("href")) return;

      lookup.checkSingle(searchParams.get("href"))
        .then(isMalicious => {
            setMessage(isMalicious ? "This link does not seem safe.." : "Redirecting you to link!")
            if(!isMalicious){
                window.location.href = searchParams.get("href"); 
            }
        })
        .catch(err => {
            
            console.log(err);
            setMessage("This link does not seem safe...");

        });

    }, [searchParams])
    


    return (
        <>
            <Navbar />
            <div className='redirect-wrapper' style={{height : "100%"}}>
                <h1>{message}</h1>
                <img className='redirect_illus' src={redirect_illus} alt="Redirect Illustration" />
                <br />
                <a href={searchParams.get("href")}>
                    <Button type='default' size="large" icon={<LinkOutlined />}>Go to link</Button>
                </a>
            </div>
        </>
    )
}

export default Redirect;