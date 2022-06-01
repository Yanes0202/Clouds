import React, { useEffect, useState } from "react";
import "./Feed.css";
import PostCreator from "./PostCreator";
import Post from "./Post";
import db from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const q = query(collection(db,'posts'), orderBy("timeStamp","desc"))
    onSnapshot(q,(snapshot) =>(
      setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
    ))
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