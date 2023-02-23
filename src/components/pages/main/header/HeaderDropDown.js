import "./HeaderDropDown.css";
import { getAuth, signOut } from "firebase/auth";
import { actionTypes } from "../../../context/reducer";
import { useStateValue } from "../../../context/StateProvider";



function HeaderDropDown({ onClose }){

    const [state, dispatch] = useStateValue();

    // LOGOUT USER
    const logOut= ()=> {
        const auth = getAuth();
        signOut(auth).then(() => {
            dispatch({
                type: actionTypes.SET_USER,
                user: null        
            });
            // TODO: ADD POPUP WITH SUCCESS FULL LOG OUT
        }).catch((error) => {
            console.error(error);
        })
        dispatch({
            type: actionTypes.SET_USER,
            user: null
        })
    };


    return (
    <>
        <div className="dropDown_overlay" onClick={()=>onClose(false)}/>
        <div className="dropDown_content">
            <div className="dropDown_item">Settings</div>
            <div className="dropDown_item" onClick={logOut}>Log Out</div>
        </div>
    </>);
}

export default HeaderDropDown