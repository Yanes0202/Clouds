import './App.css';
import Header from './components/pages/main/header/Header';
import Feed from './components/pages/main/body/Feed';
import Login from './components/pages/login/Login';
import { useStateValue } from './components/context/StateProvider';
import UsersList from './components/pages/main/userList/UsersList';
import { getAuth } from 'firebase/auth';
import Teams from './components/pages/main/teams/Teams';
import { actionTypes } from './components/context/reducer';
import { useEffect, useState } from 'react';

function App() {
  const [state, dispatch] = useStateValue();
  const [{user}] = useStateValue();

  useEffect(() => {
    const auth = getAuth();    
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        dispatch({
        type: actionTypes.SET_USER,
        user: user
        });
      } else {
      }
    });
  },[user])

  // Check if user is logged in.    
    // TODO: Move this check maybe to App.js    
    
  return (
    <div className="app">
      
      {user ? (
        <>
          <Header />

          <div className="app_body">
            <div className="app_left">
              {/*<Teams/>*/}
            </div>

            <div className="app_center">
              <Feed/>
            </div>

            <div className="app_right">
              <UsersList/>
            </div>
          </div>
        
        </>

        ) : (<Login />)
      }
      
    </div>
  );
}

export default App;
