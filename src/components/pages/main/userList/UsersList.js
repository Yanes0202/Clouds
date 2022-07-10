import db from "../../../context/firebase";
import {
  collection,
  onSnapshot
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./UsersList.css";
import User from "./User.js"
import { useStateValue } from "../../../context/StateProvider";


function UsersList() {
  const [users, setUsers] = useState([]);
  const[{user}] = useStateValue();

  // FILTER TO SHOW USERS WITHOUT CURRENT USER
  const usersFilter = users.filter((u)=> {
      return u.id!==user.uid;
  }) 

  useEffect(() => {
    onSnapshot(collection(db,"users"), (snap) =>(
      setUsers(snap.docs.map(doc => ({id: doc.id, data: doc.data()})))
    ))
    
  });

  return (
    <div className="users">
      <h3>Kontakty</h3>
      {usersFilter.map((u) => (
        <User 
        key={u.id} 
        id={u.id}
        name={u.data.name}
        profilePic={u.data.profilePic}
        logTimeStamp={u.data.logTimeStamp}
        />
  ))}
    </div>
  );
}

export default UsersList;
