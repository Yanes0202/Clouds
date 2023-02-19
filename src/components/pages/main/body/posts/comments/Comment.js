import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import "./Comment.css";
import db from "../../../../../context/firebase";
import { collection, serverTimestamp, addDoc, } from "firebase/firestore";
import { useStateValue } from "../../../../../context/StateProvider";
import activity from "../../../../../context/activity";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentDropDown from "./CommentDropDown";

function Comment({ commentId, postId, timeStamp, body, profilePic, userName, userId, replies}) {
  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');
  const [{user}] = useStateValue();
  const [newComment, setNewComment] = useState("");
  const [replyForm, setReplyForm] = useState(false);
  const [dropDownAvailable, setDropDownAvailable] = useState(false);
  const [ConfigDropDown, setConfigDropDown] = useState(false);

  // Format data
  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")+" "+[d.getHours(),
    minutes].join(":");

    useEffect(() => {
      /* Check if post is created by current user */
      if(userId === user.uid) { setDropDownAvailable(true) }
    },[userId])

  // Create Comment
  const createComment = async (e) => {
    e.preventDefault();

    const createCommentData = {
      "body": "@" + userName + " " + newComment,
      "timeStamp": serverTimestamp(),
      "parentId": commentId,
      "postId" : postId,
      "userId" : user.uid
    }
    
    if(newComment) {
      await addDoc(collection(db, "comments"),createCommentData);
      toggleReplyForm();
      setNewComment("")
    }
    
  };

  // Filter Comments to get replied comments
  function getReplies() {
    return replies.filter((comments) => comments.data.parentId === commentId);
  }

  // Toggle Reply Form
  const toggleReplyForm = () => {
    setReplyForm(!replyForm);
  }

  // Be visible as online
  const beOnline = () => {
    activity(user.uid);
  }

  const dropDown = () => {
    if(dropDownAvailable){
      setConfigDropDown(true)
    }
  }

  return (
    
    <div className="comment">
      <div className="comment_top">
        <Avatar src={profilePic} onClick={beOnline}/>
        
        <div className="comment_base">
          <div className="comment_body">
            <h4>{userName}</h4>
            <p>{body}</p>
          </div>

          <div className="comment_option">
            <p className="option_buttons" onClick={()=>{
              beOnline();
            }}>Like</p>
            <p className="option_buttons" onClick={toggleReplyForm}>Reply</p>
            {dformat}
          </div>
                
        </div>

        <div className={dropDownAvailable ? "comment_more enabled" : "comment_more disabled" } onClick={dropDown}>
            <MoreVertIcon/>
        </div>
        {ConfigDropDown && <CommentDropDown onClose={setConfigDropDown} commentId={commentId}/>}
        
            
      </div>

      {replyForm ? (
        <div id={commentId} className="comment_create_reply">
          <Avatar src={user.photoURL}/>
          <form onSubmit={createComment}>
            <input 
            value = {newComment}
            onChange = {(e)=>setNewComment(e.target.value)}
            placeholder="Reply"/>
            <button type="submit" hidden/>
          </form>
          
        </div>) : null
        }

      {getReplies().length > 0 && (
        <>
        {getReplies().map((reply) => (
          
          <Comment 
          key={reply.id}
          commentId={reply.id}
          postId={postId}
          timeStamp={reply.data.timeStamp}
          body={reply.data.body}
          profilePic={reply.userData.profilePic}
          userName={reply.userData.name}
          userId = {reply.userId}
          replies={replies}
          />
          
        ))}
        </>)}
        
    </div>
  )
}

export default Comment