// Handling requests for finding the profile of other users
import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App';
import { useParams } from 'react-router-dom';

const People = () => {
    const [mypost, setMypost] = useState([]); //refering to posts of user we r looking for
    const [newUser, setNewUser] = useState(null); //refering to user we r looking for
    const { id } = useParams(); //contains id of user we are looking for
    const { userState, dispatch } = useContext(userContext) //logged in user
   
    useEffect(() => {
        async function fetchMypost() {
            const res = await fetch(`http://localhost:5000/profile/${id}`, {
                method: "get",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            })

            const data = await res.json()
            setMypost(data.post);
            setNewUser(data.user)
        }
        fetchMypost()
    }, [])

    const followUser = async (_id) => {
        const res = await fetch("http://localhost:5000/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                _id
            })
        })
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user))
        setNewUser(data.followedUser)
        dispatch({ type: "USER", payload: data.user })
    }

    const unFollowUser = async (_id) => {
        const res = await fetch("http://localhost:5000/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                _id
            })
        })
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user)) //need to update local storage also because on page refresh we are extracting data of user from local storage
        setNewUser(data.unfollowedUser) //updating state of current user
        dispatch({ type: "USER", payload: data.user }) //updating state of logged user
    }

    return (
        <>
            {newUser
                ?
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "30px",
                    }}>
                        <div><img src={newUser.pic} style={{ height: "200px", width: "200px", borderRadius: "100px" }} alt="No photo"/></div>
                        <div style={{ marginLeft: "50px", fontSize: "20px" }}>
                            <h4>{newUser.Username}</h4>
                            <h5>{newUser.email}</h5>
                            <div>
                                <div className="profile">{mypost.length} Posts</div>
                                <div className="profile">{newUser.followers.length} Followers</div>
                                <div className="profile">{newUser.following.length} Following</div>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                {
                                    newUser.followers.includes(userState._id)
                                    ?
                                    <a class="waves-effect waves-light btn-small blue-grey lighten-1"
                                        style={{ marginRight: "15px" }}
                                        onClick={() => unFollowUser(newUser._id)}>
                                        Following
                                    </a>
                                    :
                                    <a class="waves-effect waves-light btn-small blue darken-2"
                                        style={{ marginRight: "15px" }}
                                        onClick={() => followUser(newUser._id)}>
                                        Follow
                                    </a>
                                }
                                <a class="waves-effect waves-light btn-small blue darken-2">Message</a>
                            </div>
                        </div>
                    </div>

                    <div className="profile-gallery">
                        {
                            mypost.map((post) => {
                                return (
                                    <div className="materialboxed profile-item" key={post._id}> <img src={post.photo} width="400px" height="300px" /></div>
                                )
                            })
                        }
                    </div>
                </div>
                : 
                <h1 style={{ fontFamily: `Grand Hotel, cursive`}}>loading...</h1>
            }
        </>
    );
}

export default People;