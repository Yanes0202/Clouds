import './App.css';
import Header from './components/pages/main/header/Header';
import Feed from './components/pages/main/body/Feed';
import Login from './components/pages/login/Login';
import { useStateValue } from './components/context/StateProvider';

import UsersList from './components/pages/main/userList/UsersList';
import Teams from './components/pages/main/teams/Teams';


function App() {

  const [{user}] = useStateValue();

  
  return (
    <div className="app">
      
      {!user ? (

        <Login />

      ) : (

        <>
        
          <Header />
          
          <div className="app_body">

            <div className="app_left">

              <Teams/>

            </div>

            <div className="app_center">
              
              <Feed/>

            </div>

            <div className="app_right">

              <UsersList/>

            </div>

          </div>
          
        </>

      )}
      
    </div>
  );
}

export default App;
