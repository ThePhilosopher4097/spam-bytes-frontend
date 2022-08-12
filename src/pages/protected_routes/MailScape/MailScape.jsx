import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Layout } from 'antd';
import React from 'react'
import Dashboard from '../Dashboard/Dashboard';
import "./MailScape.css"

const {Sider} = Layout;



const MailScapeWrapper = ({WidgetData, ViewData}) => {
    
    return (

        <>
            
            <Layout className='mailscape-layout'>
                <Sider width={360} className='email-widget-sider'>
                    <Input bordered={false} className='email-widget-search' placeholder='Search' prefix={<SearchOutlined />} />
                </Sider>
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