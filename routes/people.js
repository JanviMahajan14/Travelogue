// API for handling profile of other users
const express = require('express');
const auth = require('../middlewares/auth');
const Post = require('../models/post');
const User = require('../models/user');
const router = new express.Router();

router.get('/profile/:id', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-tokens -password");
         //select includes fields we don't require in response
        if (!user) {
            return res.status(400).send({ error: "No such user exists!" })
        }
        const post = await Post.find({ postedBy: user._id });
        res.send({user, post});
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.put('/follow', auth, async (req, res) => {
    try {
        const followedUser = await User.findByIdAndUpdate(req.body._id, {
            $push:{ followers: req.user._id }
        }, {
            new: true
        })

        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body._id }
        }, {
            new: true
        })

        res.send({followedUser, user})
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})

router.put('/unfollow', auth, async (req, res) => {
    try {
        const unfollowedUser = await User.findByIdAndUpdate(req.body._id, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        })

        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body._id }
        }, {
            new: true
        })

        res.send({ unfollowedUser, user })
    }
    catch (error) {
        res.statusCode = 400;
        res.send({ error: error.message })
    }
})


module.exports = router;