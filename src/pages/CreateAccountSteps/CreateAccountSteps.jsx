import { Button, Carousel, Col, Input, notification, Row } from 'antd';
import React from 'react'
import TwoPanelAuthPage from '../TwoPanelAuthPage/TwoPanelAuthPage';
import "./CreateAccountSteps.css"
import man_with_mailbox from "./assets/man-with-mailbox.png"
import { ArrowLeftOutlined, LaptopOutlined, LeftCircleFilled, LeftSquareOutlined, MobileOutlined, QrcodeOutlined, RightCircleOutlined, SafetyCertificateFilled, SafetyCertificateOutlined, SmileFilled, UsbOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { getApiPath } from '../../utils';
import axios from 'axios';

import {encode, decode} from 'base64-arraybuffer';


function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}

const LeftPane = () => {
    return (
        <>
            <div>
                <h1 className='white'>Create your Account</h1>
                <p className='white'>Safe and secure free to use emails to protect your privacy </p>
            </div>
            <img src={man_with_mailbox} alt="man_with_mailbox"></img>
        </>
    )
}

const verbose = {
    first_name : "First Name",
    last_name : "Last Name",
    phone : "Phone Number",
    backup_email : "Backup Email",
    authentication_method : "Authentication Method",
}
const RightPane = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [first_name, set_first_name] = useState("");
    const [last_name, set_last_name] = useState("");
    const [phone, set_phone] = useState("");
    const [backup_email, set_backup_email] = useState("");

    const [error_first_name, set_error_first_name] = useState("");
    const [error_last_name, set_error_last_name] = useState("");
    const [error_phone, set_error_phone] = useState("");
    const [error_backup_email, set_error_backup_email] = useState("");


    const navigate = useNavigate();

    const carousel_ref = useRef();


    if(!searchParams.has("email")) navigate("/create_account"); 

    const handleInputField = (event) => {

        const name = event.target.getAttribute("name");
        let val = event.target.value;

        let setter;

        switch (name) {
            case "first_name":
                setter = set_first_name
                break;
        
            case "last_name":
                setter = set_last_name
                break;
        
            case "phone":
                val = val.replace(/\D/g, "");
                setter = set_phone
                break;
        
            case "backup_email":
                setter = set_backup_email
                break;
            default:
                break;
        }

        if(setter) setter(val);
    }

    const please_enter = (term) => {
      return `Please enter your ${verbose[term]}.`
    }

    const tryStep1Complete = () => {


        let nextStep = true;

        // INPUTS BLOCK ENDS

        if(!first_name){
            set_error_first_name(please_enter("first_name"));
            nextStep = false;
        }
        else set_error_first_name("");

        if(!last_name){
            set_error_last_name(please_enter("last_name"));
            nextStep = false;
        }
        else set_error_last_name("");

        if(!phone){
            set_error_phone(please_enter("phone"));
            nextStep = false;
        }
        else set_error_phone("");

        if(!backup_email){
            set_error_backup_email(please_enter("backup_email"));
            nextStep = false;
        }
        else if(!validEmail(backup_email)){
            set_error_backup_email("Please enter a valid backup Email.");
            nextStep = false;
        }
        else set_error_backup_email("");

        if(!nextStep) return;
        
        // INPUTS BLOCK ENDS

        carousel_ref.current.next();
    }


    const getFIDOChallenge = async (fido_method) => {
        const set_email = searchParams.get("email");

        try {
            const response = await axios.post(
                getApiPath("users/FIDO/register/challenge/fetch"),
                {
                    user_data : {
                        email : set_email,
                        first_name,
                        last_name,
                        backup_email,
                        phone,
                        login_method : "fido2"
                    },
                    fido_method,
                },
                {},
            )

            const challenge_data = response.data;

            const challenge_string = challenge_data.challenge;
            challenge_data.challenge = decode(challenge_data.challenge);
            
            challenge_data.user.id = decode(challenge_data.user.id);

            console.log("Challenge data : ", challenge_data);
            
            const publicKeyCredentials = await navigator.credentials.create({publicKey : challenge_data});

            // console.log("publicKeyCredentials : ", publicKeyCredentials);

            const clientAttestationResponse = {
                response : {
                    clientDataJSON : encode(publicKeyCredentials.response.clientDataJSON),
                    attestationObject : encode(publicKeyCredentials.response.attestationObject)
                },
                userHandle : encode(challenge_data.user.id),
                id : publicKeyCredentials.id,
                rawId : encode(publicKeyCredentials.rawId),
                authenticatorAttachment : publicKeyCredentials.authenticatorAttachment,
                type : publicKeyCredentials.type,
                challenge : challenge_string,
                email : set_email
            }

            // console.log("clientAttestationResponse : ", clientAttestationResponse, publicKeyCredentials);
            // return;
            try {
                const response = await axios.post(
                    getApiPath("users/FIDO/register/challenge/auth"),
                    clientAttestationResponse,
                    {}
                );
                
                const registration_data = response.data;
                console.log(registration_data);
                
                notification.success({
                    icon : <SafetyCertificateFilled className='success-green' />,
                    message : "Registered successfully!",
                    description : "FIDO Authentication verified successfully!"
                })

                navigate("/sign_in");


            } catch (error) {
                console.log(error);
                notification.error({
                    message : "Error faced in FIDO Auth",
                    description : error.response.data.message ? error.response.data.message : "Oops, there seems to be some error..."
                })
            }
            
        } catch (error) {
            console.log(error)
            
            await axios.post(
                getApiPath("FIDO/challenge/pending/prune"),
                {set_email},
            );
            notification.error({
                message : "Error faced in FIDO Auth",
                description : error.response.data.message ? error.response.data.message : "Oops, there seems to be some error..."
            })
        }

    }
    
    return (
        <div className='createaccountsteps-wrapper'>
            

            <Carousel initialSlide={0} fade ref={carousel_ref} slide='2' className='carousel'>
                <div>
                    <div className="inputs-container">
                        <h1>Enter Details</h1>
                        <p>Please enter your details to create your account.</p>
                        <h2 style={{textDecoration : 'underline', color : "#5759A3", fontSize : "1.6em", margin : "0.3em 0"}}>{searchParams.get("email")}</h2>

                        <br />

                        <div className="input-wrapper">
                            <div>First Name</div>
                            <Input onChange={(event) => handleInputField(event)} value={first_name} name='first_name' size='large' placeholder='Enter your first name' />
                            {error_first_name != "" && <p className='auth-error'>{error_first_name}</p>}
                        </div>
                        <div className="input-wrapper">
                            <div>Last Name</div>
                            <Input onChange={(event) => handleInputField(event)} value={last_name} name='last_name' size='large' placeholder='Enter your last name' />
                            {error_last_name != "" && <p className='auth-error'>{error_last_name}</p>}
                        </div>
                        <div className="input-wrapper">
                            <div>Phone Number</div>
                            <Input maxLength={13} type="tel" onChange={(event) => handleInputField(event)} value={phone} name='phone' size='large' placeholder='Enter your phone number' />
                            {error_phone != "" && <p className='auth-error'>{error_phone}</p>}
                        </div>
                        <div className="input-wrapper">
                            <div>Backup Email</div>
                            <Input type="email" onChange={(event) => handleInputField(event)} value={backup_email} name='backup_email' size='large' placeholder='Enter your backup email' />
                            {error_backup_email != "" && <p className='auth-error'>{error_backup_email}</p>}
                        </div>
                        {/* <div className="input-wrapper">
                            <div>Password</div>
                            <Input name='password' size='large' placeholder='Enter your password' />
                        </div>
                        <div className="input-wrapper">
                            <div>Confirm password</div>
                            <Input name='confirm_password' size='large' placeholder='Confirm your password' />
                        </div> */}
                        <br />
                        <br />
                        <br />
                        <div className="flex-center">
                            <Button style={{transform : "scale(1.1)"}} shape='round' className='primary-shadow dark' size='large' type='primary' onClick={() => tryStep1Complete()}>
                                Choose Authentication Method <RightCircleOutlined/>
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{width : '100%'}}>
                    <Button onClick={() => carousel_ref.current.prev()}  prefix icon={<ArrowLeftOutlined />}  >Go back</Button>
                    <br />
                    <div className="inputs-container">
                        <h1>2-factor Authentication</h1>
                        <h2>Enhance your account's security using FIDO2 verification</h2>

                        <br />
                        <br />

                        <div className="fido-buttons-wrapper">
                            <Button size="large" type='primary' onClick={() => getFIDOChallenge("platform")} className='fido-button' >
                                User your current device
                                <LaptopOutlined/>
                            </Button>
                            <br />
                            <Button size="large" type='primary' className='fido-button' onClick={() => getFIDOChallenge("cross-platform")} >

                                <div>Use alternate trusted method</div>
                                
                                <span style={{maxWidth : "1.5em"}}>
                                    <Carousel dots={0} speed={500} autoplaySpeed={1000} vertical autoplay style={{padding : "0px !important"}}>
                                        <MobileOutlined className='carousel-button-icon' />
                                        <QrcodeOutlined className='carousel-button-icon' />
                                        <UsbOutlined className='carousel-button-icon' />
                                    </Carousel>
                                </span>
                            </Button>
                        </div>

                    </div>
                </div>
            </Carousel>
            
            <br />

            

        </div>
    )
}

const CreateAccountSteps = () => {

    return (
        <TwoPanelAuthPage Content1={LeftPane} Content2={RightPane} />
    )
}

export default CreateAccountSteps;