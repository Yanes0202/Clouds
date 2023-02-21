import React, { useEffect, useState } from "react";
import "./Feed.css";
import PostCreator from "./posts/PostCreator";
import Post from "./posts/Post";
import db from "../../../context/firebase";
import { collection, onSnapshot, orderBy, query, doc, getDoc } from "firebase/firestore";
import { useStateValue } from '../../../context/StateProvider';
import activity from "../../../context/activity";


function Feed() {
  const [ posts, setPosts ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [{user}] = useStateValue();

  const userCollectionName = "users";
  const postsCollectionName = "posts";

  // Get post user data by post user id
  const getUserDataByPostId = (posts) => {
    return Promise.all(
      posts.map(async (post) => {
        const postData = post.data();
        var userData = await getDoc(doc(db,userCollectionName,postData.user));
        
        if(!userData.exists()){
          console.log("User doesn't exist in database");
        }else{
          return {
            id: post.id,
            userId: userData.id,
            userData: userData.data(),
            data: postData
          };
        }
      })
    )
  }

  useEffect(() => {
    let cancelPreviousPromiseChain = undefined;
    const q = query(collection(db, postsCollectionName), orderBy("timeStamp", "desc"));

     onSnapshot(q,(snapshot) => {
      if (cancelPreviousPromiseChain) cancelPreviousPromiseChain();

      let cancelled = false;

      cancelPreviousPromiseChain = () => cancelled = true;
      
      getUserDataByPostId(snapshot.docs)
      .then((result) =>{
        if (cancelled) return;
        setLoading(false);
        setPosts(result);
      })
      .catch((error) => {
        if(cancelled) return;
        setLoading(false);
        console.log(error);
      });
    });
  },[]);
  
  // Be visible as online
  const beOnline = () => {
    activity(user.uid);
  }

  // Loader
  if(loading){
    return (
      <div className="loader">
        <div/>
      </div>
    )
  }
  
  return (
    <div className="feed">
        <PostCreator/>
        
        {posts.map((post) => ( 
           
            <Post
              key={post.id}
              postId={post.id}
              profilePic={post.userData.profilePic}
              message={post.data.message}
              timeStamp={post.data.timeStamp}
              userId = {post.userId}
              userName={post.userData.name}
              image={post.data.image}
              likes={post.data.likes}
            />
        ))
        }
    </div>
  )
  }


export default Feed