const express = require("express");
const router = express.Router();

const { register, login, getAllUsers, getUserbyId, addFriend, deleteFriend } = require("../controllers/UserController");

router.post('/register', register);
router.post('/login', login);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserbyId);
router.patch('/addfriend/:id', addFriend);
router.delete('/deletefriend/:id', deleteFriend);

module.exports = router;