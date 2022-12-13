import { runTransaction, doc, serverTimestamp } from "firebase/firestore";
import db from "./firebase";

// TRANSACTION | GET USER AND UPDATE LOGTIMESTAMP
const activity = async (userId)=>{
    
    try {
        await runTransaction(db, async(transacton) => {
            const document = await transacton.get(doc(db,"users",userId));
            if(!document.exists()){
                throw "Document does not exist!";
            }
            transacton.update(doc(db,"users",userId), { logTimeStamp: serverTimestamp()})
        })
    }catch(e){
        console.log("Activity update failed: ",e);
    }
    
};

export default activity