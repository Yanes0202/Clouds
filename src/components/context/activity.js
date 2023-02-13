import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import db from "./firebase";

// TRANSACTION | GET USER AND UPDATE LOGTIMESTAMP
const activity = async (userId) => {
    await setDoc(doc(db, "users",userId), { logTimeStamp: serverTimestamp()}, {merge: true})
};

export default activity