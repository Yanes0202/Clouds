import React from "react";
import "./Login.css";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import db, { auth } from "../../context/firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import activity from "../../context/activity";

function Login() {
    const [state, dispatch] = useStateValue();

    // LOGIN AND ADDING USER TO DB
    const signIn = ()=>{
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        const docRef = doc(db, "users", result.user.uid);
        // check if user exist
        getDoc(docRef).then((snap) => {
          // if not
          console.log(snap.data())
          if (!snap.exists()){
            console.log(result.user.displayName);
            const postData = {
              name: result.user.displayName,
              logTimeStamp: serverTimestamp(),
              password: "",
              profilePic: result.user.photoURL
            }
            //create user
            setDoc(doc(db, "users",result.user.uid),postData); 
            activity(result.user.uid);
          }
        });

        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      
      })
      .catch((error) =>{
        console.log(error.message);
      })
     
    };

  return (
    <div className="login">
        <div className="login_logo">
            <CloudIcon />
            <h1> Welcome on Clouds </h1>
        </div>
        <Button type="submit" 
        onClick={signIn}>
            Sign In
        </Button>

    </div>
  )
}

export default Login