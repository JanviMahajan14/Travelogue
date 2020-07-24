import React, { useState, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import { userContext } from '../../App';
import M from 'materialize-css';

const Signup = () => {
    const { userState, dispatch } = useContext(userContext)
    const history = useHistory();
    const [Username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = async()=>{
        try{
            const res = await fetch("http://localhost:5000/users/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Username,
                    email,
                    password
                })
            }) 

            const data = await res.json()
            if(data.error){
                throw new Error(data.error);
            }

            localStorage.setItem("jwt",data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type:"USER", payload: data.user })
            M.toast({ html: "Saved Successfully!", classes: "green darken-1" })
            history.push('/explore')
        }
        catch(e){
            M.toast({ html: e.message, classes: "red darken-1"})
        }
    }

    return (
        <div class="card blue-grey darken-1 auth-card">
            <div class="card-content white-text">
                <span class="card-title">BUDDY</span>
                <input className="input-field" type="text" placeholder="Username" value={Username} onChange={(e)=>setUsername(e.target.value)} />
                <input className="input-field" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div class="card-action">
                <button class="btn waves-effect waves-light" type="submit" name="action" onClick={() => postData()}>
                   SignIn
                </button>
            </div>
            <p><Link to="/login" className="bottom-heading">Already have an account ?</Link></p>
        </div>
    );
}

export default Signup;