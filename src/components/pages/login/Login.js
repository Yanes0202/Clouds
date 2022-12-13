import "./Login.css";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import GoogleIcon from '@mui/icons-material/Google';
import db, { auth } from "../../context/firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import activity from "../../context/activity";
import React, { useRef, useState } from "react";

function Login() {
    const [state, dispatch] = useStateValue();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    // LOGIN AND ADDING USER TO DB
    const googleLogIn = () =>{
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
      .then((result) => {
        
        const docRef = doc(db, "users", result.user.uid);
        // check if user exist
        getDoc(docRef).then((snap) => {
          // if not
          if (!snap.exists()){
            
            const postData = {
              name: result.user.displayName,
              logTimeStamp: serverTimestamp(),
              password: "",
              profilePic: result.user.photoURL
            }
            //create user
            setDoc(doc(db, "users",result.user.uid),postData); 
          
          }
        });
        
        activity(result.user.uid);

        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      
      })
      .catch((error) =>{
        console.log(error.message);
      })
     
    };

    // CHECKING IN DB AND LOGIN
    const logIn = () => {
    };

    // SENDING TO DB AND LOGIN
    const signIn = () => {
    };

    const changeView = () => {
      var one = document.getElementById("one");
      var two = document.getElementById("two");
      var logIn = document.getElementById("logIn");
      var signInDiv = document.getElementById("signIn");
      one.style.animation = "disappearing 1s";
      logIn.style.animation = "disappearing 1s";
      logIn.style.display = "none";
      two.style.animation = "appearing 1s";
      signInDiv.style.animation = "appearing 1s"
    };

  return (
    <div className="login">
      <h1> Welcome on Clouds </h1>
        <div className="login_logo">
            <CloudIcon id="one"/>
            <CloudIcon id="two"/>
            
        </div>
        <div className="login_logIn" id="logIn">
          <form className="login_form">
            Name: 
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            Password: 
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <Button type="submit"onClick={logIn}>
              Log in
            </Button>
          </form>

          <Button type="submit" 
            onClick={googleLogIn}>
            <GoogleIcon/>
          </Button>

          <Button className="logIn_button" onClick={changeView}>Click to<br/> Sign In</Button>
        </div>
        <div className="login_singIn" id="signIn">
          <form className="singIn_form">
            Name: 
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            Password: 
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <Button type="submit"onClick={signIn}>
              Sign in
            </Button>
          </form>

          <Button className="logIn_button" onClick={changeView}>Click to<br/> Sign In</Button>
        </div>
    </div>
  )
}

export default Login