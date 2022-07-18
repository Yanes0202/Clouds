import "./HeaderDropDown.css";
import { actionTypes } from "../../../context/reducer";
import { useStateValue } from "../../../context/StateProvider";



function HeaderDropDown({ onClose }){

    const [state, dispatch] = useStateValue();

    // LOGOUT USER
    const logOut= ()=> {
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