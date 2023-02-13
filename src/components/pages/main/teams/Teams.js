import "./Teams.css";
import db from "../../../context/firebase";
import {
  collection,
  onSnapshot
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Team from "./Team";

function Teams() {
    const [teams,setTeams] = useState([]);

    useEffect(() => {
        onSnapshot(collection(db,"teams"), (snap) =>(
            setTeams(snap.docs.map(doc => ({id: doc.id, data: doc.data()})))
        ))
    });
    
    return (
        <div className="teams">
            <h3>Teams</h3>

            {teams.map((t) => (
                <Team
                key={t.id}
                id={t.id}
                userCount={t.data.userCount}
                />
            ))}
        </div>
    );

}

export default Teams