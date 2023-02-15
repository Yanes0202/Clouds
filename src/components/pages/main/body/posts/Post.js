import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Comment from './comments/Comment';
import db from "../../../../context/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc, getDoc, doc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";
import "./Post.css";
import activity from "../../../../context/activity";
import parse from "html-react-parser";
import PostDropDown from "./dropDown/PostDropDown.js";

function Post({postId, profilePic, image, userName, timeStamp, userId, message}) {

  const [comments, setComments] = useState([]);
  const [{user}] = useStateValue();
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [configDropDown, setConfigDropDown] = useState(false);
  const [dropDownAvailable, setDropDownAvailable] = useState(false);

  const usersCollectionName = "users";
  const commentsCollectionName = "comments";

  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');

  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")
    +" "+[d.getHours(),
    minutes].join(":");

    /* Get userData from user db by comment id */
    const getUserDataByCommentId = (comments) => {
      return Promise.all(
        comments.map(async (comment) => {
          const commentData = comment.data();
          var userData = await getDoc(doc(db,usersCollectionName,commentData.userId));
  
          if(!userData.exists()){
            console.log("User doesn't exist in database");
          }else{
            return {
              id: comment.id,
              userId: userData.id,
              userData: userData.data(),
              data: commentData
            };
          }
        })
      )
    }

  
  useEffect(() => {
    /* Check if post is created by current user */
    if(userId === user.uid) { setDropDownAvailable(true) }

    console.log("test2")
    /* Connect to DB to get Comments */
    let cancelPreviousPromiseChain = undefined;
    const q = query(collection(db, commentsCollectionName), orderBy("timeStamp", "asc"));

     onSnapshot(q,(snapshot) => {
      if (cancelPreviousPromiseChain) cancelPreviousPromiseChain();

      let cancelled = false;

      cancelPreviousPromiseChain = () => cancelled = true;

      getUserDataByCommentId(snapshot.docs)
      .then((result) =>{
        if (cancelled) return;
        setComments(result);
      })
      .catch((error) => {
        if(cancelled) return;
        console.log(error);
      });
    });
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
  const postComments= ()=>{
    return comments.filter((comment) => comment.data.postId === postId);
  }

  /* Filter Comments to get root Comments */
  const rootComments = postComments().filter((comments) => comments.data.parentId === "null");

  /* Filter Comments to get reply Comments */
  const replyComments = postComments().filter((comments) => comments.data.parentId !== "null");

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
          {rootComments.map((comment) => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              postId={postId}
              timeStamp={comment.data.timeStamp}
              body={comment.data.body}
              profilePic={comment.userData.profilePic}
              userName={comment.userData.name}
              userId = {comment.userId}
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