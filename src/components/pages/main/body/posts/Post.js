import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Comment from './comments/Comment';
import db from "../../../../context/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { useStateValue } from "../../../../context/StateProvider";
import "./Post.css";
import activity from "../../../../context/activity";
import parse from "html-react-parser";
import PostDropDown from "./dropDown/PostDropDown.js";

function Post({postId, profilePic, image, userName, timeStamp, userId, body, likes}) {

  const [ comments, setComments ] = useState([]);
  const [{user}] = useStateValue();
  const [ newComment, setNewComment ] = useState("");
  const [ showComments, setShowComments ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ configDropDown, setConfigDropDown ] = useState(false);
  const [ dropDownAvailable, setDropDownAvailable ] = useState(false);

  const contactsTable = "contacts";
  const commentsTable = "comments";
  const postsTable = "posts";

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
          var userData = await getDoc(doc(db,contactsTable,commentData.userId));
  
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

    // Check if user is already liking
    const isUserLiking = () => {
      for (let v of likes) {
        if (v.id === user.uid) { 
          return true; 
        }
      }  
      return false;
    }
  
  useEffect(() => {
    /* Check if post is created by current user */
    if(userId === user.uid) { setDropDownAvailable(true) }
    
    if(isUserLiking()) { setLiked(true) }

    /* Connect to DB to get Comments */
    let cancelPreviousPromiseChain = undefined;
    const q = query(collection(db, commentsTable), orderBy("timeStamp", "asc"));

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
      "body": newComment,
      "timeStamp": serverTimestamp(),
      "postId" : postId,
      "userId" : user.uid,
      "likes" : []
    }

    if(newComment){
      await addDoc(collection(db, commentsTable),createCommentData);

      setNewComment("")
    }
  };
  
  /* Filter Comments to get post Comments */
  const postComments = ()=>{
    return comments.filter((comment) => comment.data.postId === postId);
  }

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

  // Toggling like 
  const toggleLike = () => {
    if(isUserLiking()) {
      var filtered = likes.filter(like => like.id !== user.uid);
      var filteredData = { likes: filtered };
      
      setDoc(doc(db,postsTable,postId), filteredData, {merge: true}).then(()=>{setLiked(false)});
    } else {
      var array = likes;
      array.push({
        name: user.displayName,
        id: user.uid
      })
      var enrichedData = { likes: array };
      
      setDoc(doc(db,postsTable,postId), enrichedData, {merge: true}).then(()=>{setLiked(true)})
    }
  }

  // Getting Names of users that gave like
  const getLikesName = () => {
    var string = "";    
    likes.map(a=>{return string += a.name + "\n"});
    
    return string;
  }

  // Be visible as online 
  const beOnline = () => {
    activity(user.uid);
  }

  // Show dropDown 
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
        {configDropDown && <PostDropDown onClose={setConfigDropDown} postId={postId} image={image} body={body}/>}

      </div>

      <div className="post_bottom">
        {parse(body)}
      </div>
      
      {image ? 
        (
        <div className="post_image">
          <img src={image} alt="" />
        </div>
        )
        : null
      }
      <div className="post_informations">
        
        <div className="informations_left">
          <p className={likes.length === 0 ? null : "hovertext"} data-hover={getLikesName()}>{likes.length} Likes</p>
        </div>
        
        <div className="informations_center">
          <p> {postComments().length} Comments</p>
        </div>

        <div className="informations_right">

        </div>

      </div>

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
          {postComments().map((comment) => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              postId={postId}
              timeStamp={comment.data.timeStamp}
              body={comment.data.body}
              profilePic={comment.userData.profilePic}
              userName={comment.userData.name}
              userId = {comment.userId}
              likes = {comment.data.likes}
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