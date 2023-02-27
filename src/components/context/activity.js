import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import db from "./firebase";

const activity = async (userId) => {
    await setDoc(doc(db, "contacts",userId), { logTimeStamp: serverTimestamp()}, {merge: true});
};

export default activity