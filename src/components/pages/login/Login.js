import React from "react";
import "./Login.css";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import db, { auth } from "../../context/firebase.js";
import {  setPersistence, signInWithPopup, GoogleAuthProvider, browserSessionPersistence } from "firebase/auth";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import activity from "../../context/activity";

function Login() {
    const [state, dispatch] = useStateValue();
    const usersTable = "users";
    const contactsTable = "contacts";

    // LOGIN AND ADDING USER TO DB
    const signIn = () => {
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          const provider = new GoogleAuthProvider();
          return signInWithPopup(auth, provider)
            .then((result) => {
              const docRef = doc(db, usersTable, result.user.uid);
              // check if user exist
              getDoc(docRef).then((snap) => {
                // if not
                if (!snap.exists()) {
                  const signInData = {
                    name: result.user.displayName,
                    logTimeStamp: serverTimestamp(),
                    password: "",
                    profilePic: result.user.photoURL
                  }

                  const contactsData = {
                    name: result.user.displayName,
                    logTimeStamp: serverTimestamp(),
                    profilePic: result.user.photoURL
                  }
                  //create user
                  setDoc(doc(db, usersTable,result.user.uid),signInData);
                  setDoc(doc(db,contactsTable,result.user.uid),contactsData);
                  activity(result.user.uid);
                }
              });
              dispatch({
                type: actionTypes.SET_USER,
                user: result.user
              });
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