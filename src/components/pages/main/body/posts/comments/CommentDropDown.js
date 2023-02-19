import "./CommentDropDown.css";
import { doc, deleteDoc } from "firebase/firestore";
import db from "../../../../../context/firebase";


function CommentDropDown({ onClose, commentId, image, message }){

    const commentsTable = "comments";

    const eventEdit = () => {
        
    }

    const eventDelete = async () => {
        await deleteDoc(doc(db,commentsTable,commentId));
    }

    return (
    <div className="wrapper">
    
    
        <div className="dropDown_overlay" onClick={()=>onClose(false)}/>
        <div className="commentDropDown">
            
                <div className="commentDropDown_item" onClick={eventEdit}>Edit</div>
                <div className="commentDropDown_item" onClick={eventDelete}>Delete</div>
            
            
        </div>
    
    </div>);
}

export default CommentDropDown