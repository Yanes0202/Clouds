import React, { useRef, useState } from 'react';
import "./PostCreator.css";
import Avatar from '@mui/material/Avatar';
import { useStateValue } from "../../../../context/StateProvider";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import db from '../../../../context/firebase';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import CreatePostPopUp from "./CreatePostPopUp";
import activity from '../../../../context/activity';

function PostCreator() {
    const[{user}] = useStateValue();
    const [input, setInput] = useState("");
    const [image, setImage] = useState("");
    const [imageURL,setImageURL] = useState("");
    const filePickerRef = useRef(null);
    const [ popup, setPopup ] = useState(false);


    // FEATURE | Add image, show it's small version
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

    // Be visible as online
    const beOnline = () => {
        activity(user.uid);
    }

    //Create post
    const createPost = async (e) => {
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
        {popup && <CreatePostPopUp onClose={setPopup}/>}
    
        <div className="postCreator_top">
            
            
            <Avatar src={user.photoURL} onClick={beOnline} />
            <button className="popup_button"
            onClick={()=>{
                beOnline();
                setPopup(true);
            }}>
                {"What's on your mind, "+ user.displayName+"?"}
            </button>
            

            {/*image &&(
                <div onClick={removeImage} className="smallImage">
                    <img src={image} alt=""/>
                    <p>Remove</p>
                </div>
            )*/}
        </div>
        {/*<div className="postCreator_bottom">
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
            
        </div>*/}
        
        </div>
  )
}

export default PostCreator