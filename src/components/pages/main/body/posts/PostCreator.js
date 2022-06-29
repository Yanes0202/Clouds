import React, { useRef, useState, useEffect } from 'react';
import "./PostCreator.css";
import Avatar from '@mui/material/Avatar';
import { useStateValue } from "../../../../context/StateProvider";
import { addDoc, collection, onSnapshot, serverTimestamp, doc } from 'firebase/firestore';
import db from '../../../../context/firebase';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import CreatePostPopUp from "./CreatePostPopUp";

function PostCreator() {
    const[{user}] = useStateValue();
    const [input, setInput] = useState("");
    const [image, setImage] = useState("");
    const [imageURL,setImageURL] = useState("");
    const filePickerRef = useRef(null);
    const [ popup, setPopup ] = useState(false);


    // FEATURE | show popup
    const showPopup = ()=>{
        setPopup(true);
        console.log(popup)
    }

    // FEATURE | close popup
    const closePopup = () => {
        setPopup(false);
    }

    // FEATUER | Add image, show it's small version
    const addImage = (e)=>{
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setImage(readerEvent.target.result);
        };
    };

    // FEATURE | remove display of attached image
    const removeImage = () => {
        setImage(null);
    };

    //Create post
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            profilePic: user.photoURL,
            userName: user.displayName,
            timeStamp: serverTimestamp(),
            message: input,
            image: imageURL,
        }

        await addDoc(collection(db, "posts"),postData);

        setInput("");
        setImageURL("");
    }

  return (
    <div className="postCreator">
        {(popup==true) ? (<CreatePostPopUp onClose={setPopup()} />) : "" }
    
        <div className="postCreator_top">
            

            <Avatar src={user.photoURL}/>
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

                <button onClick={handleSubmit} type="submit"></button>
            </form>

            {image &&(
                <div onClick={removeImage} className="smallImage">
                    <img src={image} alt=""/>
                    <p>Remove</p>
                </div>
            )}
        </div>
        <div className="postCreator_bottom">
            <div className="inputIcon">   
            
            </div>
            <div onClick={() => filePickerRef.current.click()} className="inputIcon">
                <p>Attach Picture</p>
                <PhotoCameraRoundedIcon className="imageIcon" fontSize="large"/>
                <input
                ref={filePickerRef}
                onChange={addImage}
                type="file"
                hidden
                />
            </div>
            <div className="inputIcon">

            </div>

        </div>
    </div>
  )
}

export default PostCreator