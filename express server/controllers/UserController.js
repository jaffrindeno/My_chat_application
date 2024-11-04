const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err,hashedPass) => {
        if(err) {
            res.status(500).json({
                message: err.message
            })
        }
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
        user.save()
            .then(user => {
                res.status(201).json(user)
            })
            .catch(error => {
                res.json({
                    message: "An error occured."
                })
            })
    })
}

const login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ $or: [{email: username},{username:username}] }).populate('friends','_id username')
        .then(user => {
            if(user) {
                bcrypt.compare(password, user.password, (err,result) => {
                    if(err) {
                        res.status(500).json({
                            message: err.message
                        })
                    }
                    if(result) {
                        //If TRUE
                        res.status(200).json(user)
                    } else {
                        res.status(401).json({
                            message: "Password does not match"
                        })
                    }
                })
            } else {
                res.status(404).json({
                    message: "No user found"
                })
            }
        })
}

const getAllUsers = async(req,res) => {
    try{
        const users = await User.find().populate('friends', '_id username');
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const getUserbyId = async(req,res) => {
    let userId = req.params.id;
    let user;
    try{
        user = await User.findById(userId).populate('friends', '_id username');
        res.json(user);
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const addFriend = async(req,res) => {
    let username = req.body.username;

    try {
        let loggedInUser = await User.findById(req.params.id).populate('friends', '_id username');
        const user = await User.findOne({ $or: [{email:username},{username:username}] }).populate('friends', '_id username');
        if(user && loggedInUser) {
            if((
                loggedInUser.friends.length !==0 &&
                loggedInUser.friends.findIndex(friend => friend._id.equals(user._id)) !== -1
            ) || (
                user.friends.length !==0 &&
                user.friends.findIndex(friend => friend._id.equals(loggedInUser._id)) !== -1
            )) {
                return res.status(400).json({
                    message: "Already added!"
                })
            }
        }
        loggedInUser.friends.push(user);
        loggedInUser.save();
        user.friends.push(loggedInUser);
        user.save();
        res.status(200).json(loggedInUser); 
    } catch (err) {
        res.status(400).json({
            message: "User not found."
        })
    }
}

const deleteFriend = async(req,res) => {
    let username = req.body.username;

    try{
        let loggedInUser = await User.findById(req.params.id).populate('friends', '_id username');
        const user = await User.findOne({ $or: [{email:username}, {username: username}] }).populate('friends', '_id username');
        if (loggedInUser && user) {
            loggedInUser.friends.splice(user.friends.findIndex(friend => friend._id.equals(user._id)),1);
            loggedInUser.save();
            user.friends.splice(loggedInUser.friends.findIndex(friend => friend._id.equals(loggedInUser._id)),1);
            user.save();
            res.status(200).json(loggedInUser)
        }
    } catch(err) {
        res.status(400).json({
            message: "User not found."
        })
    }
}

module.exports = { register, login, getAllUsers, getUserbyId, addFriend, deleteFriend }