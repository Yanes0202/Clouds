import "./CreatePostPopUp.css";
import { useStateValue } from "../../../../context/StateProvider";
import React, { useRef, useState } from "react";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import db from "../../../../context/firebase";
import Avatar from '@mui/material/Avatar';
import activity from "../../../../context/activity";

function CreatePostPopUp({ onClose, children }){
    const[{user}] = useStateValue();
    const [input, setInput] = useState("");
    const [imageURL,setImageURL] = useState("");

    //Create post
    const createPost = async (e) => {
        e.preventDefault();

        const postData = {
            user: user.uid,
            timeStamp: serverTimestamp(),
            message: input,
            image: imageURL,
        }

        await addDoc(collection(db, "posts"),postData);

        setInput("");
        setImageURL("");
        document.body.classList.remove('active-modal') 
        onClose(false);
    }

    // Be visible as online
    const beOnline = () => {
        activity(user.uid);
    }

    return (
        <div className="popup">
            {document.body.classList.add('active-modal')}
            <div className="popup_overlay" onClick={()=>{document.body.classList.remove('active-modal') 
                onClose(false)}}></div>
            <div className="popup_content">
                <div className="popup_header">
                    <h1>Create Post</h1>
                    <button className="close_btn" onClick={()=>{
                    document.body.classList.remove('active-modal') 
                    onClose(false)
                    }}>x</button>
                </div>
                <div className="popup_post_create">
                    <div className="popup_user_info">
                    <Avatar src={user.photoURL} onClick={beOnline} />
                    <h5>{user.displayName}</h5>
                    </div>
                    <form>
                        <input
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        className="postCreator_input"
                        placeholder={"What's on your mind, "+ user.displayName+"?"}/>
                
                        <input
                        value={imageURL}
                        onChange={(e)=>setImageURL(e.target.value)}
                        placeholder="Image URL"/>

                        <button onClick={createPost} type="submit" className="submit">Opublikuj</button>
                    </form>
                </div>

                
                {children}
            </div>
        </div>
    );
}

export default CreatePostPopUp
