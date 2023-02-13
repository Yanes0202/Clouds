import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Comment from './Comment';
import db from "../../../../context/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";
import "./Post.css";
import activity from "../../../../context/activity";
import parse from "html-react-parser";
import PostDropDown from "./PostDropDown.js";

function Post({postId, profilePic, image, userName, timeStamp, userId, message}) {

  const [comments, setComments] = useState([]);
  const [{user}] = useStateValue();
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [configDropDown, setConfigDropDown] = useState(false);
  const [dropDownAvailable, setDropDownAvailable] = useState(false);

  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');

  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")
    +" "+[d.getHours(),
    minutes].join(":");

  
  useEffect(() => {
    /* Check if post is created by you */
    if(userId === user.uid) { setDropDownAvailable(true) }
    /* Connect to DB to get Comments */
    const q = query(collection(db,'comments'), orderBy("timeStamp","asc"));
    onSnapshot(q,(snapshot) =>(
      setComments(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
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
      "postId" : postId,
      "userId" : user.uid
    }

    if(newComment){
      await addDoc(collection(db, "comments"),createCommentData);

      setNewComment("")
    }
  };
  
  /* Filter Comments to get post Comments */
  const postComments= (id)=>{
    return rootComments.filter((comment) => comment.data.postId === id);
  }

  /* Filter Comments to get root Comments */
  const rootComments = comments.filter((comments) => comments.data.parentId === "null");

  /* Filter Comments to get reply Comments */
  const replyComments = comments.filter((comments) => comments.data.parentId !== "null");

  /* Togle Comment Div */
  const toggleComments = ()=>{
    setShowComments(!showComments);
  }

  /* Function required for post like hover  */
  const likeHover = (event) => {
    if(showComments){
      event.currentTarget.classList.remove("left")
    } else {
      event.currentTarget.classList.add("left")
    }
  }

  /* Function required for post share hover */
  const shareHover = event => {
    if(showComments){
      event.currentTarget.classList.remove("right")
    } else {
      event.currentTarget.classList.add("right")
    }
  }

  /* Toggling like */
  const toggleLike = () => { setLiked(!liked);}

  /* Be visible as online */
  const beOnline = () => {
    activity(user.uid);
  }

  /* Show dropDown */
  const dropDown = () => {
    if(dropDownAvailable){
      setConfigDropDown(true)
    }
  }

  return (
    <div className="post">
      
      <div className="post_top">
        <Avatar src={profilePic}
        className="post_avatar"
        onClick={beOnline}
        />

        <div className="post_top_info">
          <h3>{userName}</h3>
          <p>{dformat}</p>
        </div>


        <div className={dropDownAvailable ? "post_top_more enabled" : "post_top_more disabled" } onClick = {dropDown}>
          <MoreVertIcon/>
        </div>
        {configDropDown && <PostDropDown onClose={setConfigDropDown} postId={postId} image={image} message={message}/>}

      </div>

      <div className="post_bottom">
        <p>{parse(message)}</p>
      </div>
      
      {image ? 
        (
        <div className="post_image">
          <img src={image} alt="" />
        </div>
        )
        : null
      }
      
      <div className="post_actions" style={{borderBottom: showComments ? "1px solid lightgray" : "none"}} >

        <div className="post_action left" onClick={toggleLike} onMouseEnter={likeHover} >
          {liked ? <ThumbUpRoundedIcon/> : <ThumbUpOutlinedIcon/> }
          <p>Like</p>
        </div>

        <div className="post_action" onClick={()=>{toggleComments();}}>
          <CommentOutlinedIcon />
          <p>Comment</p>
        </div>

        <div className="post_action right" onClick={beOnline} onMouseEnter={shareHover}>
          <ShareOutlinedIcon />
          <p>Share</p>
        </div>

      </div>

      {showComments ?
        <div className="post_comments">
          {postComments(postId).map(comment => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              postId={postId}
              timeStamp={comment.data.timeStamp}
              body={comment.data.body}
              userId={comment.data.userId}
              parentId={comment.data.parentId}
              replies={replyComments}
            />
          ))}

          <div className="post_create_comment">

            <Avatar src={user.photoURL}/>

            <form onSubmit={createComment}>

              <input 
                value = {newComment}
                onChange = {(e)=>setNewComment(e.target.value)}
                placeholder = "Write Comment"
              />

              <button type = "submit" hidden/>

            </form>

          </div>
        </div>
        :
        null
      }

    </div>
  )
}

export default Post