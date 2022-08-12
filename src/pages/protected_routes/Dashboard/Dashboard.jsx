import { BugOutlined, FileSyncOutlined, InboxOutlined, MailFilled, PlusOutlined, SendOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { Children } from 'react'
import { useState } from 'react';
import Navbar from './Navbar/Navbar';
import "./Dashboard.css"

const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
const menu_items = [

    getItem("Inbox", "inbox", <InboxOutlined/>),
    getItem("Starred Mails", "star", <StarOutlined/>),
    getItem("Malicious Mails", "malicious", <BugOutlined/>),
    getItem("Sent", "sent", <SendOutlined/>),
    getItem("Drafts", "drafts", <FileSyncOutlined/>),

]

const Dashboard = ({Content}) => {

    console.log(Content)

    const [collapsed, setCollapsed] = useState(true);
    const [composeBtnText, setComposeBtnText] = useState("");


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