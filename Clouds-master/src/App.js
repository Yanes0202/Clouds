import './App.css';
import Header from './components/pages/main/header/Header';
import Feed from './components/pages/main/posts/Feed';
import Login from './components/pages/login/Login';
import { useStateValue } from './components/context/StateProvider';
import CreatePostPopUp from './components/pages/main/posts/CreatePostPopUp';

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

            </div>

            <div className="app_center">

            <Feed/>

            </div>

          </div>
          
        </>

      )}
      
    </div>
  );
}

export default App;
