import { Button, notification } from 'antd'
import React from 'react'
import "./SignIn.css"
import man_with_door from "./assets/man_with_door.png"
import TwoPanelAuthPage from '../TwoPanelAuthPage/TwoPanelAuthPage'
import { Input } from 'antd'
import { ExclamationCircleOutlined, LoginOutlined } from '@ant-design/icons'
import { useState } from 'react'
import axios from "axios";
import { getApiPath } from '../../utils'
import { useNavigate } from "react-router-dom";



const LeftPane = () => {
    return (
        <>
            <div style={{textAlign : "left", width : "100%"}}>
                <h1 className='white' >SpamBytes</h1>
                
                <p className='white'>Sign in or create a new account to continue </p>
            </div>
            <img src={man_with_door} alt="man_with_mailbox"></img>
        </>
    )
}

const RightPane = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();


    const tryLogin = async () => {
        let errs = [];

        setEmailError("");
        setPasswordError("");

        let all_good = true;


        if(!email){
            all_good = false;
            setEmailError("Please enter your Email.");
        }
        // else if(!validateEmail(email)){
        //     all_good = false;
        //     setEmailError("Please enter a valid Email.");
        // }
        if(!password){
            all_good = false;
            setPasswordError("Please enter your password.");
        }

        console.log(email, password)

        if(!all_good) return;

        try {
            let res = await axios.post(
                getApiPath("auth/login"),  
                {
                    email : email,
                    password : password
                }
            );
            console.log("LOGGED IN SUCCESSFULLY : ", res.data);

            window.localStorage.setItem("spambytes_user_data", res.data);
            // navigate("/dashboard")
        } catch (err) {
            if(err.response){
                if(err.response.data){
                    notification.open({
                        message : "Authentication Error",
                        description : err.response.data.message ? err.response.data.message : err.response.data,
                        icon : <ExclamationCircleOutlined style={{color : "#ff3939"}} />
                    })
                }
            }
        }

    }

    const getFIDOChallenge = async () => {
        try {
            const response = await axios.post(
                getApiPath("users/FIDO/register/challenge/fetch"),
                {
                    user_id : "62f4df3dde07d581591f6a4c"
                },
                {},
            )
    
            const challenge = response.data;
            
            challenge.challenge = new ArrayBuffer();
            
            challenge.user.id = Uint8Array.from(window.atob(challenge.user.id), c=>c.charCodeAt(0))
            console.log(challenge);



            const clientAttestationResponse = await navigator.credentials.create({publicKey : challenge});
    
            console.log(clientAttestationResponse)
            
        } catch (error) {
            console.log(error)
            notification.error({
                message : "Error faced in FIDO Auth",
                description : error.message ? error.message : "Oops, there seems to be some error..."
            })
        }

    }




    return (
        <>

            <div className="inputs-container">
                <div style={{textAlign : 'center'}}>
                    <h1>Welcome back!</h1>
                    <p>Proceed to log into your account.</p>
                </div>
                <br /><br />
                <div className="input-wrapper">
                    <div>Email</div>
                    <Input type="email" onChange={(e) => setEmail(e.target.value)} name='email' size='large' placeholder='Enter your email' />
                    {emailError && <p className='auth-error'>{emailError}</p>}
                </div>
                <br />
                <div className="input-wrapper">
                    <div>Password</div>
                    <Input type="password" onChange={(e) => setPassword(e.target.value)} name='password' size='large' placeholder='Enter your password' />
                    {passwordError && <p className='auth-error'>{passwordError}</p>}
                </div>
                
            </div>

            
            <br />

            <div className="flex-center">
                <Button onClick={tryLogin} style={{transform : "scale(1.1)"}} shape='round' className='primary-shadow dark' size='large' type='primary'>
                    Sign In <LoginOutlined/>
                </Button>
            </div>

            <Button onClick={getFIDOChallenge}>Get Challenge</Button>

        </>
    )
}

const SignIn = () => {

    return (
        <TwoPanelAuthPage Content1={LeftPane} Content2={RightPane} />
    )
}

export default SignIn;