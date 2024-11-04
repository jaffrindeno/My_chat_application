const express = require("express");
const router = express.Router();

const {getChatbyId, getAllChats, newChat, deleteChat} = require("../controllers/ChatController");

router.get('/chat/:id', getChatbyId);
router.get('/chat', getAllChats);
router.post('/chat', newChat);
router.delete('/chat/:id', deleteChat);

module.exports = router;
