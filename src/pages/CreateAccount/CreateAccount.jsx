import { Button, Col, Input, notification, Row } from 'antd';
import React, { useState } from 'react'
import { CheckCircleFilled, ConsoleSqlOutlined, ExclamationCircleOutlined, FrownOutlined, LoadingOutlined, RightCircleOutlined, SmileOutlined } from "@ant-design/icons";

import "./CreateAccount.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getApiPath } from '../../utils';



const CreateAccount = () => {

    const [emailFieldWidth, setEmailFieldWidth] = useState("240px");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState(["Please create your Email "]);

    const navigate = useNavigate();

    const validateEmail = async (input, length) => {
        let errs = [];

        if(length < 5){
            errs.push("Username should contain atleast 5 or more characters.");
            return;
        }
        const available = await checkUsername(input);

        if(!available){
            errs.push("Username is already taken! Please try some other username.");
        }

        setErrors(errs);
    }

    const calculateWidthForEmailField = (input) => {
        // if(!/[A-Za-z0-9_]/)
        setUsername(input);

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        const length = input.length;

        validateEmail(input, length);
        
        if(length == 0){
            setEmailFieldWidth("240px");
            return;
        }
        
        const rem = 20;

        let width = 0;

        if(length > 0){
            if(length < 20){
                width = 15.5;
            }
            else{
                width = 13;
            }
        }

        const target_width = rem + width * length;
        setEmailFieldWidth(target_width);
    }

    const checkUsername = async (username) => {
        const ans = await axios.post(getApiPath("email/check"), {
            email : username + "@spambytes.tech"
        },
        )

        return ans.data.message == 'false';

    }

    

    return (
    <div>
        <div className='menubar'>
            <Button type='link' className='link-button'>Help</Button>
            <Button size='large' className='action-button button-shadow'> Sign In</Button>
        </div>
        <div className="wrapper sitting-girl-background">
            <div className="container">
            <Row justify='center' align="middle" >
                <Col>
                    <h1 className='white'>Create your Email</h1>
                    <p className="white" style={{textAlign : "center"}}>First step towards creating your new secure Email.</p>
                </Col>
            </Row>
            <br />
            <br />
            <Row align='middle' justify='center'>
                <Input 
                    bordered={false}  
                    className='white email-field' 
                    placeholder='your_username' 
                    size='large' 
                    style={{width : emailFieldWidth}}    
                    onChange={(event) => calculateWidthForEmailField(event.target.value)}
                    value={username}
                    maxLength={30}
                    autoFocus
                />
                <Input disabled value="@spambytes.tech" id="spambytes" bordered={false} style={{textAlign : "left"}} className="white email-field" size='large' suffix={loading ? <LoadingOutlined/> : errors.length ? <ExclamationCircleOutlined style={{color : "#ff3939"}} /> : <CheckCircleFilled style={{color : "#10BC4B"}} />} />
            </Row>
            {errors.length > 0 && 
                <Row style={{paddingTop : "1.6em"}}>
                    <div className="errors-container primary-shadow">
                        {errors.map(error => {
                            return (
                                <p className='error'> <ExclamationCircleOutlined/> {error}</p>
                            )
                        })}
                    </div>
                </Row>
            }

            <br /><br /><br />

            <Button onClick={() => {if(errors.length == 0) navigate(`/create_account/continue?email=${username}@spambytes.tech`)}} disabled={errors.length > 0} style={{transform : "scale(1.2)"}} shape='round' className='primary-shadow dark' size='large' type='primary'>
                Continue <RightCircleOutlined/>
            </Button>
            </div>


            
            
        </div>
    </div>
    )
}

export default CreateAccount;