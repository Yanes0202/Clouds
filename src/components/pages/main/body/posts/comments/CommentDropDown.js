import "./CommentDropDown.css";
import { doc, deleteDoc } from "firebase/firestore";
import db from "../../../../../context/firebase";


function CommentDropDown({ onClose, commentId, edit, replies }){

    const commentsTable = "comments";

    const eventEdit = () => {
        edit(true);
        onClose(false);
    }

    const eventDelete = async () => {
        await deleteDoc(doc(db,commentsTable,commentId));
        onClose(false);
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