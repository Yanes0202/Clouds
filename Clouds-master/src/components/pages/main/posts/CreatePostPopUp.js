import React from "react";
import "./CreatePostPopUp.css"

function CreatePostPopUp(trigger,onClose,children){
    
    const close=()=> {
        onClose(false);
    }

    return (
        <div className="popup">
            {document.body.classList.add('active-modal')}
            <div className="popup_overlay" ></div>
            <div className="popup_content">
                HELLO TO TWOJ POP UP POJEBANY!
                <button className="close_btn" onClick={function close(){onClose(false)}}>close</button>
                {children}
            </div>
        </div>
    );
}

export default CreatePostPopUp
