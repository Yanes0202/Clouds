import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Comment from './Comment';
import Button from "@mui/material/Button";
import db from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useStateValue } from "./StateProvider";
import "./Post.css";

function Post({postId,profilePic, image, userName, timeStamp, message}) {

  const [comments,setComments] = useState([]);
  const[{user}] = useStateValue();

  const d = new Date(timeStamp?.toDate());
  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")+" "+
    [d.getHours(),
    "00"].join(":");
  
  /* Connect to DB to get Comments */
  useEffect(()=>{
    const q = query(collection(db,'comments'), orderBy("timeStamp","desc"))
    onSnapshot(q,(snapshot) =>(
      setComments(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
    ))
  },[]);

  /* Create Comment method */
  const createComment = () => {

  };
  
  /* Filter Comments to get post Comments */
  const postComments= (id)=>{
    return rootComments.filter((comment) => comment.data.postId == id);
  }

  /* Filter Comments to get root Comments */
  const rootComments = comments.filter((comments) => comments.data.parentId === "null");

  /* Filter Comments to get replied comments */
  const getReplies = (commentID) =>{
    return comments.filter((comments) =>comments.data.parentId === commentID)
    .sort((a,b) => new Date(a.data.timeStamp).getTime() - new Date(b.data.timeStamp).getTime());
  }
  
  

/* Togle Comment Div */
const showComments = ()=>{
/*
  let commentDiv = document.getElementById({postId}).style.display
  if(commentDiv=="flex"){
    document.getElementById({postId}).style.display = "none";
  }else{
    document.getElementById({postId}).style.display = "flex";
  }*/

}


  return (
    <div className="post">
      <div className="post_top">
        <Avatar src={profilePic}
        className="post_avatar"/>
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
        <div className="post_option" >
          <ThumbUpOutlinedIcon />
          <p>Like</p>
        </div>
        <div className="post_option" onClick={showComments}>
          <CommentOutlinedIcon />
          <p>Comment</p>
        </div>
        <div className="post_option" >
          <ShareOutlinedIcon />
          <p>Share</p>
        </div>
      </div>
      <div id={postId} className="post_comments">
        <div className="post_create_comment">
          <Avatar src={user.photoURL}/>
          <form onSubmit={createComment}>
            <input placeholder="Write Comment"/>
          </form>
          <Button hidden/>
        </div>
        {postComments(postId).map(comment=> (
          <Comment
            key={comment.id}
            timeStamp={comment.data.timeStamp}
            userName={comment.data.userName}
            body={comment.data.body}
            userId={comment.data.userId}
            parentId={comment.data.parentId}
            profilePic={comment.data.profilePic}
          />
        ))}
      </div>

    </div>
  )
}

export default Post