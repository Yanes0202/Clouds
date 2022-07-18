import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Comment from './Comment';
import db from "../../../../context/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";
import "./Post.css";
import activity from "../../../../context/activity";

function Post({postId,profilePic, image, userName, timeStamp, message}) {

  const [comments,setComments] = useState([]);
  const[{user}] = useStateValue();
  const [newComment,setNewComment] = useState("");

  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');

  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")
    +" "+[d.getHours(),
    minutes].join(":");
  
  const q = query(collection(db,'comments'), orderBy("timeStamp","desc"))

  /* Connect to DB to get Comments */
  useEffect(()=>{
    onSnapshot(q,(snapshot) =>(
      setComments(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
    ))
    
  },[]);

  /* Create Comment method */
  const createComment = async (e) => {
    e.preventDefault();

    const createCommentData = {
      "userName": user.displayName,
      "body": newComment,
      "timeStamp": serverTimestamp(),
      "parentId": "null",
      "profilePic": user.photoURL,
      "postId" : postId
    }

    await addDoc(collection(db, "comments"),createCommentData);

    setNewComment("")
  };
  
  /* Filter Comments to get post Comments */
  const postComments= (id)=>{
    return rootComments.filter((comment) => comment.data.postId == id);
  }

  /* Filter Comments to get root Comments */
  const rootComments = comments.filter((comments) => comments.data.parentId === "null");

  /* Filter Comments to get reply Comments */
  const replyComments = comments.filter((comments) => comments.data.parentId !== "null");

  /* Togle Comment Div */
  const showComments = ()=>{
    let commentDiv = document.querySelector("div[id='"+postId+"'] :nth-child(5)").style.display
    if(commentDiv=="flex"){
      document.querySelector("div[id='"+postId+"'] :nth-child(5)").style.display = "none";
      document.querySelector("div[id='"+postId+"'] :nth-child(4)").style.borderBottom = "none";
      document.querySelector("div[id='"+postId+"'] :nth-child(4) > #left").classList.add("left");
      document.querySelector("div[id='"+postId+"'] :nth-child(4) > #right").classList.add("right");
    }else{
      document.querySelector("div[id='"+postId+"'] :nth-child(5)").style.display = "flex";
      document.querySelector("div[id='"+postId+"'] :nth-child(4)").style.borderBottom = "1px solid lightgray";
      document.querySelector("div[id='"+postId+"'] :nth-child(4) > #left").classList.remove("left");
      document.querySelector("div[id='"+postId+"'] :nth-child(4) > #right").classList.remove("right");
    }
  }

  // Be visible as online
  const beOnline = () => {
    activity(user.uid);
  }

  return (
    <div id={postId} className="post">
      <div className="post_top">
        <Avatar src={profilePic}
        className="post_avatar"
        onClick={beOnline} />
        <div className="post_top_info">
          <h3>{userName}</h3>
          <p>{dformat}</p>
        </div>
      </div>
      <div className="post_bottom">
        <p>{message}</p>
      </div>
      <div className="post_image">
        <img src={image} alt="" />
      </div>
      <div className="post_options">
        <div id="left" className="post_option left" onClick={beOnline}>
          <ThumbUpOutlinedIcon />
          <p>Like</p>
        </div>
        <div className="post_option" onClick={()=>{
        showComments();
        beOnline();
        }}>
          <CommentOutlinedIcon />
          <p>Comment</p>
        </div>
        <div id="right" className="post_option right" onClick={beOnline}>
          <ShareOutlinedIcon />
          <p>Share</p>
        </div>
      </div>
      <div  className="post_comments">
        {postComments(postId).map(comment => (
          
          <Comment
            key={comment.id}
            commentId={comment.id}
            postId={postId}
            timeStamp={comment.data.timeStamp}
            userName={comment.data.userName}
            body={comment.data.body}
            userId={comment.data.userId}
            parentId={comment.data.parentId}
            profilePic={comment.data.profilePic}
            replies={replyComments}
          />
        ))}

        <div className="post_create_comment">
          <Avatar src={user.photoURL} onClick={beOnline}/>
          <form onSubmit={createComment}>
            <input 
            value = {newComment}
            onChange = {(e)=>setNewComment(e.target.value)}
            placeholder="Write Comment"
            onClick={beOnline}/>
            <button type="submit" hidden/>
          </form>
          
        </div>

      </div>

    </div>
  )
}

export default Post