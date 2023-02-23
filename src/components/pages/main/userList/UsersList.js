import db from "../../../context/firebase";
import {collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./UsersList.css";
import User from "./User.js"
import { useStateValue } from "../../../context/StateProvider";


function UsersList() {
  const [users, setUsers] = useState([]);
  const[{user}] = useStateValue();

  const contactsTable = "contacts";

  useEffect(() => {
    const q = query(collection(db, contactsTable), orderBy("logTimeStamp", "desc"));
    onSnapshot(q, (snap) =>(
      setUsers(snap.docs.map(doc => ({id: doc.id, data: doc.data()})))
    ))
    
  },[]);
  

  // Filter to show users without current user
  const usersFilter = users.filter((u)=> {
    return u.id!==user.uid;
}) 

  return (
    <div className="users">
      <h3>Contacts</h3>
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
