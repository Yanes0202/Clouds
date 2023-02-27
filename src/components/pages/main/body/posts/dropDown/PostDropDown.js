import React, { useState } from "react";
import "./PostDropDown.css";
import { doc, deleteDoc, query, getDocs, collection, where } from "firebase/firestore";
import db from "../../../../../context/firebase";
import EditPostPopUp from "../popups/EditPostPopUp";
import activity from "../../../../../context/activity";
import { useStateValue } from "../../../../../context/StateProvider";

function PostDropDown({ onClose, postId, image, body }){
    const[{user}] = useStateValue();
    const [popup, setPopup] = useState(false);
    const commentsTable = "comments";
    const postTable = "posts";

    const eventEdit = () => {
        setPopup(true);
    }
    
    const deleteComment = async (id) => {
        await deleteDoc(doc(db,commentsTable,id));
    }

    const eventDelete = async () => {
        let q = query(collection(db,commentsTable),where("postId", "==", postId));
        await deleteDoc(doc(db,postTable,postId));
        const commentsList = await getDocs(q);
        beOnline();
        commentsList.forEach(async(doc) => {
            deleteComment(doc.id);
        })
    }

    const beOnline = () => {
        activity(user.uid);
    }

    return (
    <>
        {popup && <EditPostPopUp closeDropDown={onClose} onClose={setPopup} postId={postId} image={image} body={body}/>}
        <div className="dropDown_overlay" onClick={()=>onClose(false)}/>
        <div className="postDropDown">
            <div className="postDropDown_item" onClick={eventEdit}>Edit</div>
            <div className="postDropDown_item" onClick={eventDelete}>Delete</div>
        </div>
    </>);
}

export default PostDropDown