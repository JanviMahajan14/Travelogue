const express = require('express');
const auth = require('../middlewares/auth');
const Post = require('../models/post');
const router = new express.Router();

router.post('/newpost', auth, async(req,res)=>{
    try{
        const { title, body, img } = req.body;
        if (!title || !body || !img) {
            return res.status(400).send({ error: "Please fill all the fields" })
        }

        req.user.password = undefined;
        const post = new Post({
            title,
            body,
            photo:img,
            postedBy:req.user
        });
        await post.save();
        res.send(post);
    }
    catch(error){
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.get('/post', auth, async(req,res)=>{
    try{
        const post = await Post.find().populate("postedBy","_id Username").populate("comments.postedBy","_id Username").sort('-createdAt');
        res.send(post);
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.get('/me/post', auth, async(req,res)=>{
    try {
        const post = await Post.find({postedBy:req.user._id}).populate("postedBy", "_id Username");
        res.send(post);
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

//getting post of users whom we are following in home screen
router.get('/post/subscribed', auth, async (req, res) => {
    try {
        // postedBy present in following
        const post = await Post.find({ postedBy: {$in: req.user.following}}).populate("postedBy", "_id Username").populate("comments.postedBy", "_id Username");
        const myPost = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id Username").populate("comments.postedBy", "_id Username");
        res.send([...post, ...myPost ]);
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.put('/post/like', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body.post_id , { //req _id of post 
            $push: { likes: req.user._id }
        }, {
            new:true //to return the updated data
        }).populate("comments.postedBy", "_id Username")
            .populate("postedBy", "_id Username");
        res.send(post)    
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.put('/post/unlike', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body.post_id , { //req _id of post 
            $pull: { likes: req.user._id }
        }, {
            new: true //to return the updated data
        }).populate("comments.postedBy", "_id Username")
            .populate("postedBy", "_id Username");;
        res.send(post)
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.put('/post/comment', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body.post_id, { //req _id of post 
            $push: { comments: { text: req.body.text, postedBy: req.user._id }}
        }, {
            new: true //to return the updated data
        }).populate("comments.postedBy", "_id Username")
            .populate("postedBy", "_id Username");
        res.send(post)
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.delete('/deletepost/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, postedBy: req.user._id })
        if (!post) {
            return res.status(400).send({ error: "No such post available" })
        }
        post.remove();
        res.send(post)
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

module.exports=router;