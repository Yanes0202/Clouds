import './App.css';
import Header from './components/header/Header';
import Feed from './Feed';
import Login from './components/pages/Login';
import { useStateValue } from './StateProvider';


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
