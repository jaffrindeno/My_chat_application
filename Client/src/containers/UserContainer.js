import {Routes, Route} from "react-router-dom";
import Login from "../components/Login";
import Registration from "../components/Registration";
import { useContext } from "react";
import UserContext from "../UserContext";

function UserContainer() {
    const {setLoggedInUser} = useContext(UserContext);

    const fetchLogIn = async(user) => {
        const response = await fetch("http://localhost:4000/login",{
            method: "POST",
            headers: {"Content-type" : 'application/json'},
            body: JSON.stringify(user)
        });
        const savedUser = await response.json();
        setLoggedInUser(savedUser);
        return savedUser;
    }

    return(
        <>
            <Routes>
                <Route path="signup" element={<Registration />}/>
                <Route path='/' element={<Login fetchLogIn={fetchLogIn}/>}/>
            </Routes>
        </>
    );
}

export default UserContainer;