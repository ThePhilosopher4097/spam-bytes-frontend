import { BugOutlined, FileSyncOutlined, InboxOutlined, MailFilled, PlusOutlined, SendOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { Children } from 'react'
import { useState } from 'react';
import Navbar from './Navbar/Navbar';
import "./Dashboard.css"
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, link, children) {
    return {
      key,
      icon,
      children,
      label,
      link
    };
}


const Dashboard = ({Content}) => {

    const [collapsed, setCollapsed] = useState(true);
    const [composeBtnText, setComposeBtnText] = useState("");

    let navigate = useNavigate();

    const gotoView = (path) => {
        console.log("path")
        navigate("/dashboard/" + path, {replace : true});
    }

    const menu_items = [
        getItem(<Link to="/dashboard/inbox">Inbox</Link>, "inbox", <InboxOutlined onClick={() => gotoView("inbox")} />, "inbox"),
        getItem(<Link to="/dashboard/starred">Starred Mails</Link>, "star", <StarOutlined onClick={() => gotoView("star")} />, "star"),
        getItem(<Link to="/dashboard/malicious" className='malicious-menu-item'>Malicious Mails</Link>, "malicious", <BugOutlined onClick={() => gotoView("malicious")} />, "malicious"),
        // getItem(<Link to="/dashboard/sent">Sent</Link>, "sent", <SendOutlined onClick={() => gotoView("sent")} />, "sent"),
        // getItem(<Link to="/drafts">Drafts</Link>, "drafts", <FileSyncOutlined onClick={() => gotoView("draft")} />, "draft"),
    ]


    const toggleCollapsedState = () => {
      const composeText = collapsed ? "Compose" : "";
      
      if(collapsed){
        setTimeout(() => {
            setComposeBtnText(composeText);
        }, 120);
      }
      else{
          setComposeBtnText(composeText)
      }

      setCollapsed(!collapsed);
    }
    return (

    <Layout className='dashboard-wrapper'>
        <Navbar/>

        <Layout style={{height : "100%"}} >
            <Sider  onMouseEnter={toggleCollapsedState} onMouseLeave={toggleCollapsedState} className='dashboard-sidebar' theme='dark' collapsed={collapsed} onCollapse={val => setCollapsed(val)}>
                <div style={{display : "flex", alignItems : 'center', justifyContent : 'center', margin :"1.6em 0 0.8em 0"}}>
                <Button shape={collapsed && "circle"} size='big' style={{margin : "0px auto"}} type='primary' icon={<PlusOutlined />}>
                    {composeBtnText}
                </Button>
                </div>
                <Menu style={{backgroundColor : "transparent"}} mode="inline" items={menu_items} />
            </Sider>

            <Layout className='dashboard-view-container'>
                
                {Content && <Content/>}

            </Layout>

        </Layout>
        

    </Layout>
    )
}

export default Dashboard;