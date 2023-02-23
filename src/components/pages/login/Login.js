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
        .then(async() => {
          const provider = new GoogleAuthProvider();
          return signInWithPopup(auth, provider)
            .then((result) => {
              getDoc(doc(db, usersTable, result.user.uid)).then((snap) => {
                if (!snap.exists()) {
                  const usersData = {
                    name: result.user.displayName,
                    password: "",
                  }
                  setDoc(doc(db, usersTable,result.user.uid),usersData).then(activity(result.user.uid));
                } else 
                  activity(result.user.uid);
              });
              getDoc(doc(db, contactsTable, result.user.uid)).then((snap) => {
                if (!snap.exists()) {
                  const contactsData = {
                    name: result.user.displayName,
                    logTimeStamp: serverTimestamp(),
                    profilePic: result.user.photoURL
                  }
                  setDoc(doc(db,contactsTable,result.user.uid),contactsData).then(activity(result.user.uid));
                } else
                activity(result.user.uid);
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