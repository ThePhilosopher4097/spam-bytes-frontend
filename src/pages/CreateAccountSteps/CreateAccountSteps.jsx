import { Button, Col, Input, Row } from 'antd';
import React from 'react'
import TwoPanelAuthPage from '../TwoPanelAuthPage/TwoPanelAuthPage';
import "./CreateAccountSteps.css"
import man_with_mailbox from "./assets/man-with-mailbox.png"
import { RightCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
const RightPane = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();


    if(!searchParams.has("email")) navigate("/create_account"); 


    return (
        <div style={{width : '100%'}}>
            

            <div className="inputs-container">
            
                <h1>Enter Details</h1>
                <p>Please enter your details to create your account.</p>
                <h2 style={{textDecoration : 'underline', color : "#5759A3", fontSize : "1.6em", margin : "1.2em 0"}}>{searchParams.get("email")}</h2>

                <br />

                <div className="input-wrapper">
                    <div>First Name</div>
                    <Input name='first_name' size='large' placeholder='Enter your first name' />
                </div>
                <div className="input-wrapper">
                    <div>Last Name</div>
                    <Input name='last_name' size='large' placeholder='Enter your last name' />
                </div>
                <div className="input-wrapper">
                    <div>Phone Number</div>
                    <Input name='phone' size='large' placeholder='Enter your phone number' />
                </div>
                <div className="input-wrapper">
                    <div>Password</div>
                    <Input name='password' size='large' placeholder='Enter your password' />
                </div>
                <div className="input-wrapper">
                    <div>Confirm password</div>
                    <Input name='confirm_password' size='large' placeholder='Confirm your password' />
                </div>
            </div>
            
            <br />

            <div className="flex-center">
            <Button style={{transform : "scale(1.1)"}} shape='round' className='primary-shadow dark' size='large' type='primary'>
                Continue <RightCircleOutlined/>
            </Button>
            </div>

        </div>
    )
}

const CreateAccountSteps = () => {

    return (
        <TwoPanelAuthPage Content1={LeftPane} Content2={RightPane} />
    )
}

export default CreateAccountSteps;