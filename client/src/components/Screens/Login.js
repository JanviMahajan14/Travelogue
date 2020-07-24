import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { userContext } from '../../App';
import M from 'materialize-css';

const Login = () => {
    const history = useHistory();
    const { userState, dispatch } = useContext(userContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = async () => {
        try {
            const res = await fetch("http://localhost:5000/users/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user))
            dispatch({ type: "USER", payload: data.user })
            M.toast({ html: "LogIn Successfull!", classes: "green darken-1" })
            history.push('/')
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }
    return (
        <div class="card blue-grey darken-1 auth-card">
            <div class="card-content white-text">
                <span class="card-title">BUDDY</span>
                <input className="input-field" type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div class="card-action">
                <button class="btn waves-effect waves-light" type="submit" name="action" onClick={() => postData()}>
                Login 
                </button>
            </div>
        </div>
    );
}

export default Login;