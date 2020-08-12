import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../../App';
import M from 'materialize-css';

const Explore = () => {
    const { userState, dispatch } = useContext(userContext)
    const [postdata, setPostData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:5000/post", {
                method: "get",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            })

            const data = await res.json()
            setPostData(data);
        }
        fetchData()
    }, [])

    const handleLike = async (post_id, e) => {
        try {
            const res = await fetch("http://localhost:5000/post/like", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    post_id
                })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }
            const newPostData = postdata.map((item) => {
                if (item._id == post_id) {
                    return data
                }
                else {
                    return item
                }
            })
            setPostData(newPostData)
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    const handleUnLike = async (post_id) => {
        try {
            const res = await fetch("http://localhost:5000/post/unlike", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    post_id
                })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }
            const newPostData = postdata.map((item) => {
                if (item._id == post_id) {
                    return data
                }
                else {
                    return item
                }
            })
            setPostData(newPostData)
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    const makeComment = async (text, post_id) => {
        try {
            const res = await fetch("http://localhost:5000/post/comment", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    text,
                    post_id
                })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }
            const newPostData = postdata.map((item) => {
                if (item._id == post_id) {
                    return data
                }
                else {
                    return item
                }
            })
            setPostData(newPostData)
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    const handleDeletePost = async (post_id) => {
        try {
            const res = await fetch(`http://localhost:5000/deletepost/${post_id}`, {
                method: "delete",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }
            const newPostData = postdata.filter((item) => {
                return item._id !== post_id
            })
            setPostData(newPostData)
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    return (

        <div className="home">
            {
                postdata.map((post) => {
                    return (
                        <div className="card home-card" key={post._id}>
                            <div style={{ padding: "5px" }}>
                                <h5>
                                    <Link to={post.postedBy._id == userState._id ? "/profile" : `/profile/${post.postedBy._id}`} style={{ color: "black" }}>
                                        {post.postedBy.Username}
                                    </Link>
                                    {(post.postedBy._id == userState._id)
                                        ?
                                        <i class="material-icons" style={{ color: "red", cursor: "pointer", float: "right" }} onClick={() => handleDeletePost(post._id)}>delete</i>
                                        :
                                        <></>
                                    }
                                </h5>
                            </div>
                            <div className="card-image"><img src={post.photo} /></div>
                            <div className="card-content">
                                {post.likes.includes(userState._id)
                                    ?
                                    <i class="material-icons" style={{ color: "red", cursor: "pointer" }} onClick={() => handleUnLike(post._id)}>favorite</i>
                                    :
                                    <i class="material-icons" style={{ cursor: "pointer" }} onClick={() => { handleLike(post._id) }}>favorite_border</i>
                                }
                                <h6>{post.likes.length} likes</h6>
                                <h6>{post.title}</h6>
                                <p>{post.body}</p>

                                {post.comments.map((record) => {
                                    return (
                                        <h6 key={record._id}>
                                            <span style={{ fontWeight: "500" }}>
                                                <Link to={record.postedBy._id == userState._id ? "/profile" : `/profile/${record.postedBy._id}`} style={{ color: "black" }}>{record.postedBy.Username}  </Link>
                                            </span>
                                            {record.text}
                                        </h6>
                                    )
                                })}

                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, post._id)
                                    e.target[0].value = ""
                                }}>
                                    <input type="text" placeholder="Add a comment.." />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Explore;
