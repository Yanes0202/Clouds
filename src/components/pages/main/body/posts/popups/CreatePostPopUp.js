import "./CreatePostPopUp.css";
import { useStateValue } from "../../../../../context/StateProvider";
import React, { useState } from "react";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import db from "../../../../../context/firebase";
import Avatar from '@mui/material/Avatar';
import activity from "../../../../../context/activity";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

function CreatePostPopUp({ onClose, children }){
    const[{user}] = useStateValue();
    const [input, setInput] = useState("");
    const [imageURL,setImageURL] = useState("");

    const editorConfiguration = {
        
    }

    //Create post
    const createPost = async (e) => {
        e.preventDefault();

        const postData = {
            "userId": user.uid,
            "timeStamp": serverTimestamp(),
            "body": input,
            "image": imageURL,
            "likes": []
        }
        if(input){
            await addDoc(collection(db, "posts"),postData);
            setInput("");
            setImageURL("");
            document.body.classList.remove('active-modal');
            beOnline();
            onClose(false);
        } else {
            let error = document.getElementById("errorMessage");
            error.style.display = "flex";
            beOnline();
        }
        
    }

    // Be visible as online
    const beOnline = () => {
        activity(user.uid);
    }

    const handleOnChange = (e, editor) => {
        let error = document.getElementById("errorMessage");
        if(error.style.display === "flex"){
            error.style.display = "none";
        }
        setInput(editor.getData())
    }

    return (
        <div className="popup">
            {document.body.classList.add('active-modal')}
            <div className="popup_overlay" onClick={()=>{
                document.body.classList.remove('active-modal') 
                onClose(false)
                let error = document.getElementById("errorMessage");
                error.style.display = "none";
                }}></div>
            <div className="popup_content">
                <div className="popup_header">
                    <h1>Create Post</h1>
                    <button className="close_btn" onClick={()=>{
                    document.body.classList.remove('active-modal') 
                    onClose(false)
                    let error = document.getElementById("errorMessage");
                    error.style.display = "none";
                    }}>x</button>
                </div>
                <div className="popup_post_create">
                    <div className="popup_user_info">
                    <Avatar src={user.photoURL} />
                    <h5>{user.displayName}</h5>
                    </div>

                    <CKEditor
                    className = "popup_post_create_editor"
                    data = {"<p>What's on your mind, "+ user.displayName + "?<p/>"}
                    config = {editorConfiguration}
                    editor = { Editor }
                    onChange = { handleOnChange }
                    />

                    <form>
                        

                        <p id = "errorMessage">Can't be empty</p>

                        <input
                        value={imageURL}
                        onChange={(e)=>setImageURL(e.target.value)}
                        placeholder="Image URL"/>

                        <button onClick={createPost} type="submit" className="submit">Publish</button>
                    </form>
                

                    
                
                </div>

                
                {children}
            </div>
        </div>
    );
}

export default CreatePostPopUp
