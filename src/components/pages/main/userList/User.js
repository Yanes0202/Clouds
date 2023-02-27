import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import "./User.css";


function UsersList({ id, name, logTimeStamp, profilePic }) {

  // Check if user is active
  const activeCheck = () => {
    
    if (logTimeStamp ) {
      var date = new Date();
      var TEN_MIN = 600000;
      var FIVE_MIN = 300000;
      if (date - new Date(logTimeStamp?.toDate()) > TEN_MIN) {
        document.getElementById(id).style.backgroundColor="red";
      } else if(date - new Date(logTimeStamp?.toDate()) > FIVE_MIN){
        document.getElementById(id).style.backgroundColor="yellow";
      } else {
        document.getElementById(id).style.backgroundColor="green";
      }
    }
   }
  
  useEffect(()=>{
    activeCheck();
  },[logTimeStamp]);

  return (
    <div className="user">
      <div className="user_pic">
        <Avatar src={profilePic}/>
        <div className="user_active">
          <span id={id} />
        </div>
      </div>
      <div className="user_info">
        <h3>{name}</h3>
      </div>
    </div>
  );
}

export default UsersList