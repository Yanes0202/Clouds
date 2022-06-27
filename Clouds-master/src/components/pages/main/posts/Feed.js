import React, { useEffect, useState } from "react";
import "./Feed.css";
import PostCreator from "../posts/PostCreator";
import Post from "./Post";
import db from "../../../context/firebase";
import { collection, onSnapshot, orderBy, query, updateDoc, serverTimestamp, doc } from "firebase/firestore";


function Feed() {
  const [posts, setPosts] = useState([]);

  const q = query(collection(db,'posts'), orderBy("timeStamp","desc"));

  const snap = onSnapshot(q,(snapshot) =>{
    setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })));
  })

  const updateUser = async() => {
    const userData = {
      logTimeStamp : serverTimestamp()
    }
    await updateDoc(doc(db,"users","IX9t5gpel1Pzm32gnif3"),userData);
  }

  useEffect(()=>{
    console.log("wysłano");
    
    
  },[]);


  return (
    <div className="feed">
        <PostCreator/>
        
        {posts.map(post => (
          <Post
            key={post.id}
            postId={post.id}
            profilePic={post.data.profilePic}
            message={post.data.message}
            timeStamp={post.data.timeStamp}
            userName={post.data.userName}
            image={post.data.image}
          />
        ))
        }

    </div>
  )
}

export default Feed