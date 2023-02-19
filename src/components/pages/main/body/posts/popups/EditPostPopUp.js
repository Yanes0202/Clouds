import "./CreatePostPopUp.css";
import { useStateValue } from "../../../../../context/StateProvider";
import React, { useState } from "react";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import db from "../../../../../context/firebase";
import Avatar from '@mui/material/Avatar';
import activity from "../../../../../context/activity";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

function EditPostPopUp({ postId, children, image, message, closeDropDown, onClose }){
    const[{user}] = useStateValue();
    const [input, setInput] = useState(message);
    const [imageURL,setImageURL] = useState(image);
    const postTable = "posts";


    //Edit post
    const createPost = async (e) => {
        e.preventDefault();

        const postData = {
            user: user.uid,
            timeStamp: serverTimestamp(),
            message: input,
            image: imageURL,
        }

        if(input){
            await setDoc(doc(db, postTable,postId),postData);
            setInput("");
            setImageURL("");
            closePopUp();
        } else {
            let error = document.getElementById("errorMessage");
            error.style.display = "flex";
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

    const closePopUp = () => {
        document.body.classList.remove('active-modal');
        onClose(false);
        closeDropDown(false);
        let error = document.getElementById("errorMessage");
        error.style.display = "none";
    }

    return (
        <div className="popup">
            {document.body.classList.add('active-modal')}

            <div className="popup_overlay" onClick={()=>{closePopUp()}}
            />

            <div className="popup_content">
                <div className="popup_header">
                    <h1>Edit Post</h1>
                    <button className="close_btn" onClick={()=>{closePopUp()}}>x</button>
                </div>
                <div className="popup_post_create">
                    <div className="popup_user_info">
                    <Avatar src={user.photoURL} onClick={beOnline} />
                    <h5>{user.displayName}</h5>
                    </div>

                    <CKEditor
                    className = "popup_post_create_editor"
                    data = {input}
                    editor = { Editor }
                    onChange = { handleOnChange }
                    />

                    <form>
                        <p id = "errorMessage">Can't be empty</p>

                        <input
                        value={imageURL}
                        onChange={(e)=>setImageURL(e.target.value)}
                        placeholder="Image URL"
                        />

                        <button onClick={createPost} type="submit" className="submit">Publish</button>
                    </form>
                </div>
                
                {children}
            </div>
        </div>
    );
}

export default EditPostPopUp
