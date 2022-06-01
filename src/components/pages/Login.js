import React from "react";
import "./Login.css";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import { auth } from "../../firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

function Login() {
    const [state, dispatch] = useStateValue();

    const signIn = ()=>{
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
      .then((result) => {
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