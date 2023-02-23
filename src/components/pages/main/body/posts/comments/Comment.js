import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import "./Comment.css";
import db from "../../../../../context/firebase";
import { collection, serverTimestamp, addDoc, setDoc, doc } from "firebase/firestore";
import { useStateValue } from "../../../../../context/StateProvider";
import activity from "../../../../../context/activity";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentDropDown from "./CommentDropDown";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

function Comment({ commentId, postId, timeStamp, body, profilePic, userName, userId, replies, likes}) {
  const d = new Date(timeStamp?.toDate());
  const minutes= String(d.getMinutes()).padStart(2, '0');
  const [{user}] = useStateValue();
  const [ newComment, setNewComment] = useState("");
  const [ replyForm, setReplyForm] = useState(false);
  const [ dropDownAvailable, setDropDownAvailable] = useState(false);
  const [ configDropDown, setConfigDropDown] = useState(false);
  const [ edit, setEdit ] = useState(false);
  const [ editValue, setEditValue] = useState(body);
  const [ liked, setLiked ] = useState(false);

  const commentsTable = "comments";

  // Format data
  const dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join("/")+" "+[d.getHours(),
    minutes].join(":");

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

    },[userId])

  // Create Comment
  const createComment = async (e) => {
    e.preventDefault();

    const createCommentData = {
      "body": "@" + userName + " " + newComment,
      "timeStamp": serverTimestamp(),
      "parentId": commentId,
      "postId" : postId,
      "userId" : user.uid,
      "likes" : []
    }
    
    if(newComment) {
      await addDoc(collection(db, commentsTable),createCommentData);
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

  // Toggle DropDown
  const dropDown = () => {
    if(dropDownAvailable){
      setConfigDropDown(true)
    }
  }

  // Edit comments
  const editComment = async (e) => {
      e.preventDefault();

      if(editValue!==body) {
        const editCommentData = {
          "body": editValue,
          "timeStamp": serverTimestamp()
        }
        await setDoc(doc(db, commentsTable,commentId),editCommentData, {merge: true});
        setEdit(false);
      }
  }

  /* Toggling like */
  const toggleLike = () => {
    
    if(isUserLiking()){
      var filtered = likes.filter(like => like.id !== user.uid);

      var data = {
        likes: filtered
      }
      
      setDoc(doc(db,commentsTable,commentId), data, {merge: true}).then(()=>{setLiked(false)})

    } else {
      var array = likes;
      array.push({
        name: user.displayName,
        id: user.uid
      })

      var data = {
        likes: array
      }
      
    setDoc(doc(db,commentsTable,commentId), data, {merge: true}).then(()=>{setLiked(true)})
  }
  }

  return (
    
    <div className="comment">
      <div className="comment_top">
        <Avatar src={profilePic} onClick={beOnline}/>
        
        <div className="comment_base">
          <div className="comment_body">
            <h4>{userName}</h4>
            {edit ?
             (<form onSubmit={editComment} className="comment_edit_form">

              <input 
              value={editValue}
              onChange={ (e) => {setEditValue(e.target.value)}}
              />
              <button type="submit" className="save"><CheckIcon/></button>
              <button type="button" className="delete" onClick={()=>{setEdit(false); setEditValue(body)}}><ClearIcon/></button>
             
             </form>) : <p>{body}</p> }
            
          </div>

          <div className="comment_option">
            <div onClick={toggleLike} className="like">
              {liked ? <ThumbUpRoundedIcon/> : <ThumbUpOutlinedIcon/> }
            </div>
            <p className="likes">{likes.length}</p>
            <p className="option_buttons" onClick={toggleReplyForm}>Reply</p>
            {dformat}
          </div>
                
        </div>

        <div className={dropDownAvailable ? "comment_more enabled" : "comment_more disabled" } onClick={dropDown}>
            <MoreVertIcon/>
        </div>
        {configDropDown && <CommentDropDown replies={replies} onClose={setConfigDropDown} commentId={commentId} edit={setEdit} />}
        
            
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
          likes = {reply.data.likes}
          />
          
        ))}
        </>)}
        
    </div>
  )
}

export default Comment