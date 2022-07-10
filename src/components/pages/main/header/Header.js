import React, { useState } from 'react'
import CloudIcon from '@mui/icons-material/Cloud';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import "./Header.css";
import { useStateValue } from "../../../context/StateProvider";
import HeaderDropDown from './HeaderDropDown';

function Header() {
    const[{user}] = useStateValue();
    const [ dropDown, setDropDown ] = useState(false);

    const logOut=() => {  }

  return (
    <div className="header">
        <div className="header_left">
            <div className="header_option">
                <CloudIcon />
            </div>
            <div className="header_input">
                <SearchIcon />
                <input placeholder='Search on Clouds'/>
            </div>
        </div>
        
        <div className="header_center">
            <div className="header_option header_option-active">
                <HomeIcon fontSize="large"/>
            </div>
        </div>

        <div className="header_right">
            <div className="header_info">
                <Avatar src={user.photoURL}/>
                <h4>{user.displayName}</h4>
            </div>
            <div className="header_option">
                <MapsUgcOutlinedIcon/>
            </div>
            <div className="header_option">
                <NotificationsActiveIcon fontSize="large"/>
            </div>
            <div className="header_option" onClick={() => { setDropDown(!dropDown)}}>
                <ExpandMoreIcon fontSize="large"/>
            </div>
            {dropDown && <HeaderDropDown />}
        </div>
        
    </div>
  )
}

export default Header