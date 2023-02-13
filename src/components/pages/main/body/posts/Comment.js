import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import "./Comment.css";
import db from "../../../../context/firebase";
import { collection, serverTimestamp, addDoc, getDoc, doc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";
import activity from "../../../../context/activity";

function Comment({replies,commentId,postId,body,timeStamp,userId}) {
  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');
  const [{user}] = useStateValue();
  const [newComment, setNewComment] = useState("");
  const [userData, setUserData] = useState([]);
  const [replyForm, setReplyForm] = useState(false);

  // Format data
  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")+" "+[d.getHours(),
    minutes].join(":");

    const getUserData = async () => {
      const docSnap = await getDoc(doc(db, "users", userId));
      if(docSnap.exists()){
        setUserData(docSnap.data())
      }
    }

  useEffect(() => {
    getUserData()
    
  },[])


  // Create Comment
  const createComment = async (e) => {
    e.preventDefault();

    const createCommentData = {
      "userName": user.displayName,
      "body": "@" + userData.name + " " + newComment,
      "timeStamp": serverTimestamp(),
      "parentId": commentId,
      "profilePic": user.photoURL,
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

  return (
    
    <div className="comment">
      <div className="comment_top">
        <Avatar src={userData.profilePic} onClick={beOnline}/>
        
        <div className="comment_base">
          <div className="comment_body">
            <h4>{userData.name}</h4>
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

      {replyForm ? (
        <div id={commentId} className="comment_create_reply">
          <Avatar src={user.photoURL}/>
          <form onSubmit={createComment}>
            <input 
            value = {newComment}
            onChange = {(e)=>setNewComment(e.target.value)}
            placeholder="Write Comment"/>
            <button type="submit" hidden/>
          </form>
          
        </div>) : null
        }
      
        
    </div>
  )
}

export default Comment