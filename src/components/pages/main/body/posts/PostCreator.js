import React, { useState } from 'react';
import "./PostCreator.css";
import Avatar from '@mui/material/Avatar';
import { useStateValue } from "../../../../context/StateProvider";
import CreatePostPopUp from "./popups/CreatePostPopUp";
import activity from '../../../../context/activity';

function PostCreator() {
    const[{user}] = useStateValue();
    const [ popup, setPopup ] = useState(false);

    // Be visible as online
    const beOnline = () => {
        activity(user.uid);
    }


  return (
    <div className="postCreator">
        {popup && <CreatePostPopUp onClose={setPopup}/>}
    
        <div className="postCreator_top">
            
            
            <Avatar src={user.photoURL} onClick={beOnline} />
            <button className="popup_button"
            onClick={()=>{
                setPopup(true);
            }}>
                {"What's on your mind, "+ user.displayName+"?"}
            </button>
            

            {/*image &&(
                <div onClick={removeImage} className="smallImage">
                    <img src={image} alt=""/>
                    <p>Remove</p>
                </div>
            )*/}
        </div>
        {/*<div className="postCreator_bottom">
            <div className="inputIcon">   
            
            </div>
            <div onClick={() => filePickerRef.current.click()} className="inputIcon">
                <p>Attach Picture</p>
                <PhotoCameraRoundedIcon className="imageIcon" fontSize="large"/>
                <input
                ref={filePickerRef}
                onChange={addImage}
                type="file"
                hidden
                />
            </div>
            <div className="inputIcon">
            </div>
            
        </div>*/}
        
        </div>
  )
}

export default PostCreator