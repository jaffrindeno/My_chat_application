import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import FriendList from "../components/FriendList";
import Search from "../components/Search";
import "./ChatContainer.css"

const ChatContainer = ({socket, fetchChats}) => {



    const [friends, setFriends] = useState([]);
    const [isDelete, setIsDelete] = useState(false);
    const {loggedInUser, setLoggedInUser, chats, users} = useContext(UserContext);

    const navigate = useNavigate();

    const [currentChat, setCurrentChat] = useState({
        users:[],
        messages: []
    });

    const filteredChats = chats.filter(chat => {
        return chat.users.findIndex(user => user._id === loggedInUser._id) !== -1
    })

    const addFriend = async(friend) => {
        const response = await fetch(`http://localhost:4000/addfriend/${loggedInUser._id}`,{
            method: "PATCH",
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(friend)
        });
        // FriendData is actually updated logged in user.
        const friendData = await response.json();
        if (friendData && friendData.message) return;

        setLoggedInUser(friendData);
        setFriends(friendData.friends);
        const params = {
            user1_id: loggedInUser._id,
            user2_id: friend._id
        }
        socket.emit("create_chat",params);
        fetchChats();
        setIsDelete(false);
    }

    const deleteFriend = async(friend) => {
        const response = await fetch(`http://localhost:4000/deletefriend/${loggedInUser._id}`,{
            method: "DELETE",
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(friend)
        });
        const updatedUser = await response.json();
        setLoggedInUser(updatedUser);
        setFriends(loggedInUser.friends);
        deleteChat(friend);
        fetchChats();
        setIsDelete(true);
    }

    const deleteChat = async(friend) => {
        const chat = filteredChats.find(chat=> {
            return chat.users.findIndex(user => user._id === friend._id) !== -1;
        })
        await fetch(`http://localhost:4000/chat/${chat._id}`,{
            method: "DELETE",
            header: {'Content-type' : 'application/json'}
        })
    }

    const currentFriendChat = (friendChat) => {
        if(chats.findIndex(chat => chat._id === friendChat._id) !== -1){
            setIsDelete(false);
            setCurrentChat(friendChat);
            socket.emit("join_chat", friendChat._id);
        }
    }

    const filteredFriends = (searchedUser) => {
        setFriends(searchedUser)
    }
    
    useEffect(() => {
        setFriends(loggedInUser.friends);
    },[loggedInUser.friends]);

    useEffect(() => {
        fetchChats();
    },[loggedInUser.friends.length, currentChat.messages])

    useEffect(() => {
        if(isDelete) {
            setCurrentChat({
                users:[],
                messages:[]
            })
        }
    },[isDelete])

    const logOut = () => {
        setLoggedInUser();
        localStorage.removeItem('loggedInUser');
        navigate("/");
    }

    const updateChat = (message) => {
        if(currentChat.messages.findIndex(currentmessage => currentmessage._id === message._id) === -1) {
            const updatedChat = {...currentChat};
            updatedChat.messages.push(message);
            setCurrentChat(updatedChat);
        }
    }

    return(
        <div className="chat-container">
            <header className="chat-header">
                <div className="p-text">
                    <p>You are logged in as :</p>
                    <p>{loggedInUser.username}</p>
                </div>
                <div className="log-out-btn">
                    <button onClick={logOut}>Log Out</button>
                </div>
            </header>
            <main className="chat-main">
                <section id="friends-list-section">
                    <Search filteredFun={filteredFriends} addFriend={addFriend}/>
                    <FriendList friends={friends} filteredChats={filteredChats} currentFriendChat={currentFriendChat} deleteFriend={deleteFriend}/>                   
                </section>
                <section>
                    {currentChat && currentChat.users.length > 0 ? <Chat 
                        socket={socket} 
                        currentChat={currentChat} 
                        updateChat={updateChat}/> 
                    :
                    <></>
                    }
                </section>
            </main>
        </div>
    );
}

export default ChatContainer;