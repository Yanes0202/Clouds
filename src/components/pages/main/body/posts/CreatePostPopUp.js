import React from "react";
import "./CreatePostPopUp.css"

function CreatePostPopUp({onClose,children}){
    
    return (
        <div className="popup">
            {document.body.classList.add('active-modal')}
            <div className="popup_overlay" onClick={()=>{document.body.classList.remove('active-modal') 
                onClose(false)}}></div>
            <div className="popup_content">
                Input
                <button className="close_btn" onClick={()=>{document.body.classList.remove('active-modal') 
                onClose(false)}}>close</button>
                {children}
            </div>
        </div>
    );
}

export default CreatePostPopUp
