import { Autocomplete, TextField }  from "@mui/material";
import { useContext, useState } from "react";
import UserContext from "../UserContext";
import "./Search.css";

const Search = ({filteredFun, addFriend}) => {
    const {loggedInUser, users} = useContext(UserContext);
    const [searchedUser, setSearchedUser] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isFriend, setIsFriend] = useState(false);

    const optionsObjectArr = users.filter(user => user.username.toLowerCase() !== loggedInUser.username.toLowerCase()); 

    const options = optionsObjectArr.map(user => user.username);

    const filteredUser =() => users.find(user => {
        if(user.username.toLowerCase() === inputValue.toLowerCase()){
            setSearchedUser(user)
            return user
            
        } else {
            return null
        }
    })

    const filteredFriends = (username) => {
        return loggedInUser.friends.find(friend => {
            if(friend.username.toLowerCase() === username.toLowerCase()){
                setSearchedUser(friend);
                return friend
            } else {
                return null
            }
        })
    }

    const isFindFriend = () => {
        return loggedInUser.friends.find(friend => {
            const isFind = users.find(user => {
                if(user._id === friend._id) {
                    return user.username.toLowerCase() === inputValue.toLowerCase()
                } else {
                    return false
                }
            })
            setIsFriend(false);
            return isFind
        })
    } 

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue === "") filteredFun(loggedInUser.friends)
        const friend = filteredFriends(inputValue);
        if(isFindFriend() && friend) {
            filteredFun([friend]);
        }
        setInputValue("");
    }

    const handleClickToAddFriend = () => {
        if(isFindFriend() === undefined){
            const user = filteredUser()
            addFriend(user);
            setInputValue("");
        }
    }

    return(
        <div className="search">
            <div className="autocomplete">
                <Autocomplete 
                    freeSolo
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(event) => {
                        setInputValue(event.target.value);
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params}
                            label="Search username"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    type: 'search'
                                }
                            }} I
                        />
                    )}
                    />
            </div>
            <div className="right">
                <button id="search-btn" onClick={handleSubmit}>Search</button>
                <button id="add-btn" onClick={handleClickToAddFriend}>Add Friend</button>
            </div>
        </div>
    );
}

export default Search;