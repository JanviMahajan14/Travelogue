import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App'


const Navbar = () => {
    const { userState, dispatch } = useContext(userContext);
    const history = useHistory();
    const renderList = () => {
        return (
            userState ?
                <>
                    <li><i class="material-icons">search</i></li>
                    <li><Link to="/explore">Explore</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/newpost">Add Post</Link></li>
                    <li><Link to="#"
                        onClick={() => {
                        localStorage.clear()
                        dispatch({ type: 'CLEAR' })
                        history.push('/login')
                        }}>Log Out</Link>
                    </li>
                </>

                :
                <>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </>
        );
    }

    return(
        <nav>
           <div className="nav-wrapper  light-blue darken-1">
                <Link to={userState ? '/' : '/signup'} className="brand-logo">Travelogue</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
               </ul>
           </div>
       </nav>
    );
}

export default Navbar;