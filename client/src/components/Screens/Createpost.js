import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import M from 'materialize-css'; 

const Createpost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    
    // Uploading image to cloudinary
    const postImage = async() => {
        try{
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
            postData(data.url)
        }
        catch(error){
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    const postData = async (image_url) => {
        try {
            const res = await fetch("http://localhost:5000/newpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    img:image_url
                })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error);
            }

            M.toast({ html: "Uploaded Successfully!", classes: "green darken-1" })
            history.push('/')
        }
        catch (error) {
            M.toast({ html: error.message, classes: "red darken-1" })
        }
    }

    return (
        <div class="card blue-grey darken-1 post-card">
            <div class="card-content white-text">
                <input className="input-field" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input className="input-field" type="text" placeholder="What's on your mind!" value={body} onChange={(e) => setBody(e.target.value)}/>
                <div class="file-field input-field">
                    <div class="btn">
                        <span>File</span>
                        <input type="file" accept=".png,.jpg" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate input-field" type="text"/>
                    </div>
                </div>
            </div>
            <div class="card-action">
                <button class="btn waves-effect waves-light" type="submit" name="action" onClick={() => postImage()}>
                    Add Post
                </button>
            </div>
        </div>
    );
}

export default Createpost;