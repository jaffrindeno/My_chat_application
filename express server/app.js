const express = require("express");
const http = require("http");
const env = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDatabase = require("./config/connectDatabse");

const app = express();
env.config({path: path.join(__dirname, "config","config.env")});

connectDatabase();

app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, '../frontend/build')));

// app.get("*", (req,res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, ()=> console.log(`Server is running on ${PORT}`));

const userRouter = require("./routes/User");
app.use('/', userRouter);

const chatRouter = require("./routes/Chat");
app.use("/", chatRouter);

const {Server} = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods:["GET","POST","PUT","PATCH","DELETE"]
    }
});

const Chat = require("./models/Chat");

io.on("connection", (socket) => {
    console.log(`User connected: ${socket}`);
    let chatId;
    socket.on("create_chat", ({user1_id, user2_id}) => {
        const chat = new Chat({
            users: [user1_id, user2_id],
            messages: []
        })
        chat.save().then(res => io.emit("chat_created", res));
    });

    socket.on("join_chat", (chat_id) => {
        console.log("joined chat", chat_id);

        socket.join(chat_id);
        chatId = chat_id;
    });

    socket.on("change_chat", (chat_id) => {
        socket.leave(chatId);
        socket.join(chat_id);
    })

    socket.on("send_message", async({message, user_id, chat_id, created}) => {
        console.log(message, user_id, chat_id, created);
        const chat = await Chat.findById(chat_id);
        const newMessage = {
            message: message,
            user: user_id,
            created: created
        }
        chat.messages.push(newMessage);
        chat.save()
        socket.to(chat_id).emit("receive_message", chat.messages[chat.messages.length-1]);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })
});