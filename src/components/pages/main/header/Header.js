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
import activity from '../../../context/activity';

function Header() {
    const[{user}] = useStateValue();
    const [ dropDown, setDropDown ] = useState(false);

    // Be visible as online
    const beOnline = () => {
        activity(user.uid);
      }

  return (
    <div className="header">
        <div className="header_left">
            <div className="header_option" onClick={beOnline}>
                <CloudIcon />
            </div>
            <div className="header_input" onClick={beOnline}>
                <SearchIcon />
                <input placeholder='Search on Clouds'/>
            </div>
        </div>
        
        <div className="header_center">
            <div className="header_option header_option-active" onClick={beOnline}>
                <HomeIcon fontSize="large"/>
            </div>
        </div>

        <div className="header_right">
            <div className="header_info" onClick={beOnline}>
                <Avatar src={user.photoURL}/>
                <h4>{user.displayName}</h4>
            </div>
            <div className="header_option" onClick={beOnline}>
                <MapsUgcOutlinedIcon/>
            </div>
            <div className="header_option" onClick={beOnline}>
                <NotificationsActiveIcon fontSize="large"/>
            </div>
            <div className="header_option" onClick={() => { setDropDown(!dropDown)}}>
                <ExpandMoreIcon fontSize="large" onClick={beOnline} />
            </div>
            {dropDown && <HeaderDropDown onClose={setDropDown}/>}
        </div>
        
    </div>
  )
}

export default Header