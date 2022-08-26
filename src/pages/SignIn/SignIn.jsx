import { Button, notification } from 'antd'
import React from 'react'
import "./SignIn.css"
import man_with_door from "./assets/man_with_door.png"
import TwoPanelAuthPage from '../TwoPanelAuthPage/TwoPanelAuthPage'
import { Input } from 'antd'
import { ExclamationCircleOutlined, LoginOutlined, SafetyCertificateFilled } from '@ant-design/icons'
import { useState } from 'react'
import axios from "axios";
import { getApiPath } from '../../utils'
import { useNavigate } from "react-router-dom";

import {encode, decode} from 'base64-arraybuffer';


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

    const [email, setEmail] = useState("anushka@spambytes.tech");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [signInLoading, setSignInLoading] = useState(false);

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
            navigate("/dashboard")
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

    const tryFIDOAuthentication = async () => {
        setSignInLoading(true);

        try {
            const response = await axios.post(
                getApiPath("users/FIDO/login/challenge/fetch"),
                {
                    email
                },
                {}
            );
            
            const challenge_data = response.data;

            console.log(challenge_data)

            challenge_data.challenge = decode(challenge_data.challenge);
            // challenge_data.allowCredentials.forEach(cred => {
            //     cred.id = decode(cred.id);
            // })
            
            console.log("challenge_data", challenge_data);
            let obtainedAssertation = await navigator.credentials.get({publicKey : challenge_data});
            console.log("obtainedAssertation", obtainedAssertation);
            console.log(encode(obtainedAssertation.response.clientDataJSON))

            for (const key in obtainedAssertation.response) {
                if (Object.hasOwnProperty.call(obtainedAssertation.response, key)) {
                    const element = obtainedAssertation.response[key];
                    console.log(encode(element))
                }
            }

            const assertationResponse = {
                id : obtainedAssertation.id,
                response : {
                    authenticatorData : encode(obtainedAssertation.response.authenticatorData),
                    clientDataJSON : encode(obtainedAssertation.response.clientDataJSON),
                    signature : encode(obtainedAssertation.response.signature),
                    userHandle : encode(obtainedAssertation.response.userHandle),
                },
                type : obtainedAssertation.type,
                email
            }

            
            // return;
            console.log("assertationResponse", assertationResponse);

            try {
                const response = await axios.post(
                    getApiPath("users/FIDO/login/challenge/auth"),
                    assertationResponse,
                    {}
                )

                notification.success({
                    icon : <SafetyCertificateFilled className='success-green' />,
                    message : "Logged in successfully!",
                    description : "FIDO Authentication verified successfully!"
                })
                setSignInLoading(false);

                navigate("/dashboard/inbox");

            } catch (error) {
                
                setSignInLoading(false);
            }


        } catch (error) {
            console.log(error);
            notification.error({
                message : "Error faced in FIDO Auth",
                description : error.response.data.message ? error.response.data.message : "Oops, there seems to be some error..."
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
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name='email' size='large' placeholder='Enter your email' />
                    {emailError && <p className='auth-error'>{emailError}</p>}
                </div>
                {/* <br />
                <div className="input-wrapper">
                    <div>Password</div>
                    <Input type="password" onChange={(e) => setPassword(e.target.value)} name='password' size='large' placeholder='Enter your password' />
                    {passwordError && <p className='auth-error'>{passwordError}</p>}
                </div> */}
                
            </div>

            
            <br />

            <div className="flex-center">
                <Button loading={signInLoading} onClick={() => tryFIDOAuthentication()} style={{transform : "scale(1.1)"}} shape='round' className='primary-shadow dark'  type='primary'>
                    Sign In <LoginOutlined/>
                </Button>
            </div>

            {/* <Button onClick={() => getFIDOChallenge()}>Get Challenge</Button> */}

        </>
    )
}

const SignIn = () => {

    return (
        <TwoPanelAuthPage Content1={LeftPane} Content2={RightPane} />
    )
}

export default SignIn;