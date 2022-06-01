import React from 'react';
import Avatar from '@mui/material/Avatar';
import "./Comment.css";

function Comment({profilePic,userName,body,timeStamp}) {
const d = new Date(timeStamp?.toDate());
const dformat = [
  d.getDate(),
  d.getMonth()+1,
  d.getFullYear()].join("/")+" "+[d.getHours(),
    "00"].join(":");

  return (
    <div className="comment">
        <div className="comment_top">
            <Avatar src={profilePic}/>
            <div className="comment_base">
                <div className="comment_body">
                  <h4>{userName}</h4>
                  <p>{body}</p>
                </div>

                <div className="comment_option">
                    <p className="option_buttons">Like</p>
                    <p className="option_buttons">Comment</p>
                    {dformat}
                </div>
                
            </div>
            
        </div>
        
    </div>
  )
}

export default Comment