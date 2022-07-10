import "./HeaderDropDown.css";
import { actionTypes } from "../../../context/reducer";
import { useStateValue } from "../../../context/StateProvider";



function HeaderDropDown({}){

    const [state, dispatch] = useStateValue();
    const logOut= ()=> {
        dispatch({
            type: actionTypes.SET_USER,
            user: null
        })
    };


    return (
    <div className="dropDown">
        <div className="dropDown_item">Settings</div>
        <div className="dropDown_item" onClick={logOut}>Log Out</div>
    </div>);
}

export default HeaderDropDown