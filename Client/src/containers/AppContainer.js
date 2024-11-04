import { useEffect, useState } from "react";
import UserContext from "../UserContext";
import UserContainer from "./UserContainer";
import io from 'socket.io-client';
import { Route, Routes } from "react-router-dom";
import ChatContainer from "./ChatContainer";


function AppContainer() {
    const [loggedInUser, setLoggedInUser] = useState();
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);

    const socket = io.connect("http://localhost:4000");

    const fetchUsers = async() => {
        const response = await fetch("http://localhost:4000/user");
        const userData = await response.json();
        setUsers(userData);
    }

    const fetchChats = async() => {
        const response = await fetch("http://localhost:4000/chat");
        const chatData = await response.json();
        setChats(chatData);
    }

    useEffect(() => {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            setLoggedInUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
    }, [loggedInUser]);

    useEffect(()=> {
        fetchUsers();
        fetchChats();
    },[]);

    const addUser = async(newUser) => {
           const response = await fetch("http://localhost:4000/register",{
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(newUser)
           })

           const savedUser = await response.json();
           setUsers([...users,savedUser]);
    }
    return loggedInUser && loggedInUser.username ?(
        <UserContext.Provider value={{loggedInUser, users, chats,setLoggedInUser}}>
            <Routes>
                <Route path='/chat' element={<ChatContainer socket={socket} fetchChats={fetchChats}/>} />
            </Routes>
        </UserContext.Provider>
    ) : (
        <UserContext.Provider value={{loggedInUser, setLoggedInUser,addUser}}>
            <UserContainer />
        </UserContext.Provider>
    );
}

export default AppContainer;