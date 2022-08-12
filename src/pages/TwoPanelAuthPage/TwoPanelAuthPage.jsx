import React from 'react'
import "./TwoPanelAuthPage.css";


function TwoPanelAuthPage({Content1, Content2}) {
  return (
    
    <div className="wrapper">
        
        <div className="panels">
            <div className="panel">
                {<Content1/>}
            </div>
            <div className="panel glow">
                {<Content2/>}
            </div>
        </div>

    </div>

  )
}

export default TwoPanelAuthPage;