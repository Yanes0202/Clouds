import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import "./User.css";


function UsersList({ id, name, logTimeStamp }) {

  const activeCheck = () => {
    
    if (logTimeStamp ) {
      var date = new Date();

      var FIVE_MIN = 300000;
      if (date - new Date(logTimeStamp?.toDate()) > FIVE_MIN) {
        document.querySelector("#" + id).style.backgroundColor = "red";
      } else {
        document.querySelector("#" + id).style.backgroundColor = "green";
      }
    }
    
   }

  useEffect(()=>{
    activeCheck()
  },[]);

  return (
    <div className="user">
      <div className="user_pic">
        <Avatar />
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