import React, { useEffect, useState, useContext } from 'react';
import M from 'materialize-css';
import { userContext } from '../../App';

const Profile = () => {
    const [mypost, setMypost] = useState(null);
    const [uploadingBtn, setUploadingBtn] = useState(null);
    const { userState, dispatch } = useContext(userContext);
    const User = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function fetchMypost() {
            const res = await fetch("http://localhost:5000/me/post", {
                method: "get",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            })

            const data = await res.json()
            setMypost(data);
        }
        fetchMypost()
    }, [])

    const saveChangesToDb = async(url) => {
        const res = await fetch("http://localhost:5000/user/updatepic", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                url
            })
        })
        
        const data = await res.json()     
    }
    
    // Uploading image to cloudinary
    const postImage = async (image) => {
        try {
            setUploadingBtn("Updating Profile")
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', "Instagram-Clone");
            formData.append('cloud_name', "smilingcloud");

            const response = await fetch("https://api.cloudinary.com/v1_1/smilingcloud/image/upload", {
                method: "post",
                body: formData
            })

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Posting the saved changes to database
            saveChangesToDb(data.url)
            await dispatch({ type: "UPDATE PROFILE PIC", payload: { ...User, pic: data.url } })
            localStorage.setItem("user", JSON.stringify({ ...User, pic: data.url }))
            setUploadingBtn(null)
        }
        catch (error) {
            setUploadingBtn(null)
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    return (
        <>
            {mypost
                ?
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "30px",
                    }}>
                        <div><img src={userState.pic} style={{ height: "200px", width: "200px", borderRadius: "100px" }} alt="No photo" /></div>
                        <div style={{ marginLeft: "50px", fontSize: "20px" }}>
                            <h4>{User.Username}</h4>
                            <div>
                                <div className="profile">{mypost.length} Posts</div>
                                <div className="profile">{userState.followers.length} Followers</div>
                                <div className="profile">{userState.following.length} Following</div>
                            </div>
                            <div class="file-field input-field">
                                <div class="btn blue-grey lighten-1">
                                    {!uploadingBtn
                                        ?
                                        <span>Edit Profile Pic</span>
                                        :
                                        <span>Uploading ...</span>
                                    }
                                    <input type="file" accept=".png,.jpg" onChange={(e) => postImage(e.target.files[0])} />
                                </div>
                                <div class="file-path-wrapper">
                                    <input class="file-path validate" type="text" />
                                </div>
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
                <h1 style={{ fontFamily: `Grand Hotel, cursive` }}>loading...</h1>
            }
        </>
    );
}

export default Profile;