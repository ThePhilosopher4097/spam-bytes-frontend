import { ArrowDownOutlined, DownOutlined, ExpandAltOutlined, ExpandOutlined, FullscreenExitOutlined, FullscreenOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Divider, Input, notification, Select, Spin } from 'antd';
import React, { Component } from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { getApiPath } from '../../../utils';

const { Option } = Select;

const  quill_modules  = {
    toolbar: [
        // [{ font: [] }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script:  "sub" }, { script:  "super" }],
        ["blockquote", "code-block"],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
};


const EmailWindow = () => {

    const [expanded, setExpanded] = useState(false);
    const [minimized, setMinimized] = useState(true);
    const [quillValue, setQuillValue] = useState(false);
    const [recipents, setRecipents] = useState([]);
    const [subject, setSubject] = useState("");
    const [recipentSuggestions, setRecipentSuggestions] = useState([]);
    const [recipentSuggestionsLoading, setRecipentSuggestionsLoading] = useState(false);
    const [emailWindowLoading, setEmailWindowLoading] = useState(false)

    const quillRef = useRef();

    const expandWindow = () => {
        setExpanded(!expanded);
    }

    const sendMail = async () => {

      setEmailWindowLoading(true);
      const quill = quillRef.current;

      const text_content = quill.unprivilegedEditor.getText();
      const HTML_content = quill.unprivilegedEditor.getHTML();
        console.log("Sending email...")

      try {
          const result = await axios.post(
              getApiPath("email/send"),
              {
                  text : text_content,
                  html : HTML_content,
                  from : "anushka@spambytes.tech",
                  to : recipents[0],
                  subject
              }
          )

          console.log(result);
          notification.success({
            // icon : <SafetyCertificateFilled className='success-green' />,
            message : "Mail sent!",
            // description : "FIDO Authentication verified successfully!"
        })
        setEmailWindowLoading(false);

        
      } catch (error) {

        console.error(error);

        setEmailWindowLoading(false);
          
      }
    }

    const fetchSuggestions = async (param) => {
        setRecipentSuggestions([]);
        setRecipentSuggestionsLoading(true);

        try {
            const suggestions_response = await axios.post(
                    getApiPath("email/to/suggestions"),
                    {
                        email : "anushka@spambytes.tech",
                        param
                    }
            );

            if(suggestions_response.data && suggestions_response.data.recipents) setRecipentSuggestions(suggestions_response.data.recipents);

            setRecipentSuggestionsLoading(false);

        } catch (error) {
            console.log(error);
            setRecipentSuggestionsLoading(false);
        }
    }

    return (
        <Spin  spinning={emailWindowLoading}>
            <div style={{opacity : "1 !important"}} className={`email-window ${expanded && "expanded"} ${minimized && "minimized"}`}>
                <div className="email-window-header">
                    <span style={{fontSize : "1.2em"}}>Compose Mail</span>
                    <div className='btns'>
                        {/* <span>CC</span>
                        <span>BCC</span> */}
                        {!expanded ? 
                        <FullscreenOutlined id='expandWindowIcon' onClick={expandWindow} />
                        :
                        <FullscreenExitOutlined id='expandWindowIcon' onClick={expandWindow} />
                        }
                        <DownOutlined rotate={minimized && 180} id='minimiseWindowIcon' onClick={() => setMinimized(!minimized)} />
                    </div>
                </div>

                <div>
                    {/* <Input bordered={false} style={{padding : "0.3em", borderBottom : "1px solid #afb0cd71", borderRadius : "0px", marginBottom : "0.6em"}} placeholder='Recipents'></Input> */}
                    <Select loading={recipentSuggestionsLoading} onChange={setRecipents} onSearch={(e) => fetchSuggestions(e)} placeholder="Enter recipents" style={{borderBottom : "1px solid #afb0cd71", borderRadius : "0px", marginBottom : "0.6em", width : "100%"}} mode="tags" value={recipents} bordered={false}>
                        {recipentSuggestions.map(suggestion => {
                            return (
                                <Option value={suggestion}>{suggestion}</Option>
                            )
                        })}
                    </Select>
                    <Input bordered={false} onChange={(e) => setSubject(e.target.value)} value={subject} style={{padding : "0.3em 0.8em", borderBottom : "1px solid #afb0cd71", borderRadius : "0px"}} placeholder='Subject'></Input>
                </div>

                <ReactQuill ref={quillRef} theme='snow'  modules={quill_modules} value={quillValue} onChange={setQuillValue} />

                <div style={{display : "flex", justifyContent : "flex-end", width : "100%"}} >
                    <Button onClick={sendMail} type="primary"  shape='round' icon={<SendOutlined />} >Send Email</Button>
                </div>
                
                
            </div>
        </Spin>
    )
}

export default EmailWindow;