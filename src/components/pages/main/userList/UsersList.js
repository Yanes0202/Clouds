import db from "../../../context/firebase";
import {
  collection,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./UsersList.css";
import User from "./User.js"

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const user = onSnapshot(collection(db,"users"), (snap) =>(
      setUsers(snap.docs.map(doc => ({id: doc.id, data: doc.data()})))
    ))
  }, []);

  return (
    <div className="users">
      <h3>Kontakty</h3>
      {users.map((u) => (
        <User key={u.id} id={u.id} name={u.data.name} logTimeStamp={u.data.logTimeStamp}/>
      ))}
    </div>
  );
}

export default UsersList;
