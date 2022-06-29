import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import "./Comment.css";
import db from "../../../../context/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";

function Comment({replies,commentId,postId,profilePic,userName,body,timeStamp}) {
const d = new Date(timeStamp?.toDate());
const minutes= String(d.getMinutes()).padStart(2, '0');
const[{user}] = useStateValue();
const [newComment,setNewComment] = useState("");
const [comments,setComments] = useState([]);


const dformat = [
  d.getDate(),
  d.getMonth()+1,
  d.getFullYear()].join("/")+" "+[d.getHours(),
    minutes].join(":");

// Create Comment
const createComment = async (e) => {
    e.preventDefault();

    const createCommentData = {
      "userName": user.displayName,
      "body": "@"+userName+" "+newComment,
      "timeStamp": serverTimestamp(),
      "parentId": commentId,
      "profilePic": user.photoURL,
      "postId" : postId
    }

    await addDoc(collection(db, "comments"),createCommentData);
    showReplyForm();
    setNewComment("")
};

// Filter Comments to get replied comments
  function getReplies() {
    return replies.filter((comments) => comments.data.parentId === commentId)
      .sort((a, b) => new Date(a.data.timeStamp).getTime() - new Date(b.data.timeStamp).getTime());
  }

// Toggle Reply Form
const showReplyForm = () => {
  let reply = document.getElementById(commentId);
  if(reply.style.display == "flex"){
    reply.style.display = "none";
  }else{
    reply.style.display = "flex";
  }
}

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
            <p className="option_buttons" onClick={showReplyForm}>Reply</p>
            {dformat}
          </div>
                
        </div>
            
      </div>

      {getReplies().length > 0 && (
      <div className="replies">
        {getReplies().map((reply) => (
          <Comment 
          key={reply.id}
          commentId={reply.id}
          postId={postId}
          timeStamp={reply.data.timeStamp}
          userName={reply.data.userName}
          body={reply.data.body}
          userId={reply.data.userId}
          parentId={reply.data.parentId}
          profilePic={reply.data.profilePic}
          replies={replies}
          />
        ))}
        </div>)}

      <div id={commentId} className="comment_create_reply">
          <Avatar src={user.photoURL}/>
          <form onSubmit={createComment}>
            <input 
            value = {newComment}
            onChange = {(e)=>setNewComment(e.target.value)}
            placeholder="Write Comment"/>
            <button type="submit" hidden/>
          </form>
          
        </div>
        
    </div>
  )
}

export default Comment