import "./FriendList.css";

const FriendList = ({friends, filteredChats, currentFriendChat, deleteFriend}) => {

    const friendsList = friends.map(friend => {
        const chat = filteredChats.find(chat => {
            return chat.users.findIndex(user => user._id === friend._id) !== -1;
        })

        const  handleClick = () => {
            deleteFriend(friend);
        }

        return(
            <li key={friend._id}>
                <p onClick={() => currentFriendChat(chat)}>{friend.username}</p>
                <button onClick={() => handleClick(friend)}>DELETE</button>
            </li>
        );
    })

    return(
        <div id="friends-list-div">
            <h3>Friends</h3>
            <div className="friends-list-container">
                <ul className="friends-list">{friendsList}</ul>
            </div>
        </div>
    );
}

export default FriendList;