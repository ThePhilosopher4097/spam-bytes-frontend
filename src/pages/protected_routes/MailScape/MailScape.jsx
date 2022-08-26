import { BugFilled, BugOutlined, CompassFilled, CompassOutlined, CompassTwoTone, DeleteOutlined, EnterOutlined, FlagFilled, FormatPainterFilled, ProfileOutlined, SearchOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Input, Layout, notification, Skeleton, Spin, Table, Tag, Tooltip } from 'antd';
import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { capitalizeFirstLetter, getApiPath } from '../../../utils';
import Dashboard from '../Dashboard/Dashboard';
import "./MailScape.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from 'react';
import EmailWindow from './EmailWindow';
import parse, { domToReact } from 'html-react-parser';




const {Sider} = Layout;

function truncate(input) {
    if (input.length > 36) {
       return input.substring(0, 36) + '...';
    }
    return input;
 };


const MailScapeWrapper = ({WidgetData, ViewData}) => {

    const { category } = useParams()

    const [list_view, setList_view] = useState([]);
    const [list_view_loading, setList_view_loading] = useState(false);
    const [showcase, setShowcase] = useState(false);
    const [emailBody, setEmailBody] = useState(false);
    const [searchparam, setSearchparam] = useState("");

    const [sample, setSample] = useState(`<p>ajbsjhabdsa</p><p>dasbhjdbas</p><h1>asbdjhasbdhjasd</h1><p><span style="color: rgb(255, 255, 204); background-color: rgb(240, 102, 102);">jhasbdjhasbdhjasbdda</span></p>
    `)

    const quillRef = useRef();

    const getListView = async () => {
        setList_view([]);
        setShowcase(false);
        setList_view_loading(true);
        
        if(category){
            try {
                let list_emails = await axios.post(
                    getApiPath("email/fetch"),
                    {
                        user_id : "63066e974a7cd9b4b17a2501",
                        category
                    },
                    {},
                )
                list_emails = list_emails.data.docs;
                console.log(list_emails)

                setList_view(list_emails);
                setList_view_loading(false);
                
            } catch (error) {
                console.log(error);
                setList_view_loading(false);
            }
        }
    }

    useEffect(() => {
        
        getListView();
        
    }, [category])

    const getBodyContent = () => {
        const quill = quillRef.current;
        setSample(quill.unprivilegedEditor.getHTML())
    }

    const selectEmailFromList = (index) => {
        console.log(list_view[index])

        let curr = list_view[index];


        try {
            const doc = new DOMParser().parseFromString(curr.body[1].bodytext, "text/html");
            var links = doc.querySelectorAll('a');
            for(var i=0; i<links.length; ++i) links[i].href = "/dashboard/redirect?href=" + links[i].href;
            curr.body[1].bodytext = doc.body.innerHTML
        } catch (error) {
            console.log(error)
        }

        setShowcase(curr)
        
    }

    const searchMails = async () => {
        
        try {
            const res = await axios.post(
                getApiPath("email/fetch"),
                {
                    user_id : "63066e974a7cd9b4b17a2501",
                    category,
                    search_param : searchparam
                },
                {},
            )

            setList_view(res.data.docs);
        } catch (error) {
            console.log(error)
        }
    }

    const moveMail = async (email_id, from, to) => {
      
        try {
            const res = await axios.post(
                getApiPath("email/move"),
                {
                    email_id, from, to
                }
            )
            
            notification.success({
                message : "Moved to " + to + "."
            })

            setShowcase(false);

        } catch (error) {
            console.log(error);
        }
    }

    const flagUser = async (email) => {
        try {
            const res = await axios.post(
                getApiPath("email/flag/user"),
                {
                    email
                }
            )

            console.log(res);
            
            notification.success({
                message : `${email} has been flagged!`
            })

            setShowcase(false);

        } catch (error) {
            console.log(error);
        }
    }

    const deleteMail = async () => {
        
        try {
            const res = await axios.post(
                getApiPath("email/delete"),
                {
                    email_id : showcase.id,
                    category : category
                }
            )

            console.log(res);

            notification.success({
                message : "Mail deleted."
            })

            setShowcase(false);
            getListView();
        } catch (error) {
            console.log(error);
        }
    }
    
    
    
    return (

        <>
            
            <Layout className={`mailscape-layout ${category}`}>
                <Sider width={360} className='email-widget-sider'>
                    <Input 
                        bordered={false} 
                        onClick={e => searchMails()} 
                        className='email-widget-search' 
                        suffix={<Button type='primary' 
                        icon={<SearchOutlined />} />} 
                        placeholder='Search' 
                        prefix={<SearchOutlined />} 
                        value={searchparam}
                        onChange={e => setSearchparam(e.target.value)}
                        onKeyDown={e => {
                            if(e.key === "Enter") searchMails();
                        }}
                    />

                    <div className="email_list_view_wrapper">
                    {/* <div className='row'>
                        <div className="profile_and_options_wrapper">
                            <UserOutlined className='profile_skeleton_icon' />
                        </div>
                        <div className="content_wrapper">
                            <h3 className='mail_from'>
                                Anurag Taparia 
                            </h3>
                            <h4 className='subject'>
                                Asking for team updates
                            </h4>
                            <p className='content_preview'>
                                Hello Anushka, Can you just share with me the new updated team details. I have also forwaded the Lorem ipsum....
                            </p>
                        </div>
                    </div> */}
                    
                    {list_view_loading && 
                        <div style={{display : "flex", justifyContent : "center", flexFlow : "column", padding : "2em"}}>
                            <Spin spinning={list_view_loading}></Spin>
                            <span className='faded' style={{textAlign : "center"}}>Loading...</span>
                        </div>
                    }

                    {(!list_view_loading && list_view.length == 0) &&
                        <>
                            <br />
                            <Empty description="No Emails" />
                        </>
                    }
                    {list_view.map((email, index) => {

                        let spam_score = Math.min((email.spam_score/10), 1) ;
                        const opacity = 0.3 * (2*(spam_score - 0.5));

                        spam_score = spam_score * 100

                        spam_score = Math.round(spam_score * 100) / 100

                    return (
                        <div className={`row ${category == "malicious" && "malicious"}`} style={category == "malicious" ? {backgroundColor : `hsla(0, 100%, 61%,  ${opacity})`} : {}} onClick={()=>selectEmailFromList(index)}>
                            <div className="profile_and_options_wrapper">
                                {/* <img src="" alt="" /> */}
                                <UserOutlined className='profile_skeleton_icon' />
                            </div>
                            <div className="content_wrapper">
                                <h3 className='mail_from'>
                                    {email.mail_from_verbose ? email.mail_from_verbose : capitalizeFirstLetter(email.mail_from.split("@")[0])} 
                                    {category === "malicious" && 
                                        <span className='spam-score'>{spam_score}%</span>
                                    }
                                </h3>
                                <h4 className='subject'>
                                    {capitalizeFirstLetter(email.headers.subject[0])}
                                </h4>
                                <p className='content_preview'>
                                    {(typeof email.body == "string") ? truncate(email.body) : truncate(email.body[0].bodytext)}
                                </p>
                            </div>
                        </div>
                    )
                    })}
                    </div>
                </Sider>
                <Layout className='mailscape-wrapper'>
                    

                    {!showcase && 

                        <>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <CompassTwoTone id="compassRotatingIcon" twoToneColor="#dcdcf1" spin />
                            <h2 style={{'textAlign' : "center", opacity : "0.5"}}>Nothing to show here...</h2>
                        </>
                    }

                    {showcase && 
                    
                     <>
                        <div className="flex-wrapper">
                            <h1 className='email-subject'>{showcase.headers.subject[0]}</h1>
                            <div className="bubble-btn">{category} {category == "malicious" && "| " + Math.min((showcase.spam_score/10), 1)*100 + "%"}</div>
                            {category !== "malicious" ? 
                                <Tooltip title="Report malicious Email">
                                    <BugOutlined className='showcase-icons' onClick={() => moveMail(showcase._id, category, "malicious")} style={{color : "#5759A3", fontSize : "1.2em"}} />
                                </Tooltip>
                                :
                                <Tooltip title="Move to Inbox">
                                    <BugFilled className='showcase-icons' onClick={() => moveMail(showcase._id, category, "inbox")} style={{color : "#5759A3", fontSize : "1.2em"}} />
                                </Tooltip>
                            }

                            {category !== "malicious" && 
                                <Tooltip title="Flag User">
                                    <FlagFilled className='showcase-icons' onClick={() => flagUser(showcase.mail_from)} style={{color : "#E31F1F", fontSize : "1.2em"}} />
                                </Tooltip>
                            }
                        </div>

                        <Divider className='less-margin-divider' />
                        <div className="submenu-bar">
                            <div style={{display : "flex", flexFlow : "row wrap", alignItems : "center"}}>
                                <UserOutlined className='profile_skeleton_icon' />
                                <div style={{display : "flex", flexFlow : "column wrap", marginBottom : "0.2em"}}>
                                    <div className="username">
                                    {showcase.mail_from_verbose ? showcase.mail_from_verbose : capitalizeFirstLetter(showcase.mail_from.split("@")[0])}
                                    </div>
                                    <div className="email">
                                        {showcase.mail_from}
                                    </div>
                                    <div className='sec-flags'>
                                        {showcase.headers['sec-flags'].map(flag => {
                                            return (

                                                <Tag color="red">{flag}</Tag>
                                            )
                                        })}

                                        {showcase.headers["sec-interactions"] == 0 && <Tag color='red'>This is your first interaction with {showcase.mail_from}, please ensure you're conversating with the right person.</Tag>}
                                    </div>
                                </div>
                            </div>


                            <div className='side-content'>
                                <div className="faded">time</div>
                                <StarOutlined />
                                <EnterOutlined />
                            </div>

                            <Divider style={{margin : "12px 0"}} className='faded' />
                        </div>

                        <div className='email-body-wrapper'>
                            {(typeof showcase.body !== "string" && showcase.body.length >= 1) ? parse(showcase.body[1].bodytext) : showcase.body[2].bodytext }
                            {typeof showcase.body == "string" && showcase.body}
                        </div>
                        <Divider />
                        <div style={{display : "flex", flexFlow : "row wrap", justifyContent : "flex-end"}}>
                            <Button onClick={deleteMail} danger type='primary' icon={<DeleteOutlined />}>Delete Email</Button>
                        </div>
                     </>
                    }

                    
                    <div className='email-windows-holder'>
                        <EmailWindow />
                    </div>
                    
                    
                </Layout>
            </Layout>
        </>
    )
}

const MailScape = () => {

    return (
        <Dashboard Content={MailScapeWrapper} />
    )
}

export default MailScape;