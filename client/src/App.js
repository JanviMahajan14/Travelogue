import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import Home from './components/Screens/Home';
import Signup from './components/Screens/Signup';
import Login from './components/Screens/Login';
import Profile from './components/Screens/Profile';
import People from './components/Screens/People';
import Createpost from './components/Screens/Createpost';
import "./App.css";
import { initial_state, reducer } from './Reducers/userReducer';
import Explore from './components/Screens/Explore';

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {userState, dispatch} = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type:'USER', payload:user })
    }
    else {
      history.push('/signup')
    }
  },[]) //passing an empty array so that it runs only once during mounting only and not on re-rendering(during state change of user)

  return (
    <>
      <Route exact path='/'><Home /></Route>
      <Route path='/signup'><Signup /></Route>
      <Route path='/login'><Login /></Route>
      <Route exact path='/profile'><Profile /></Route>
      <Route path='/newpost'><Createpost /></Route>
      <Route path='/profile/:id'><People /></Route>
      <Route path='/explore'><Explore /></Route>
    </>
  );
}

function App() {
  const [userState, dispatch] = useReducer(reducer,initial_state)
  return (
    <userContext.Provider value={{userState, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
