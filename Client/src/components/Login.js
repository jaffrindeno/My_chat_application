import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "./Login.css"

function Login({fetchLogIn}) {

    const navigate = useNavigate();
    const {loggedInUser} = useContext(UserContext);

    const [user,setUser] = useState({
        username:"",
        password:""
    });

    function handleChange(event){
        const name = event.target.name;
        const copiedUser ={...user};
        copiedUser[name] = event.target.value;
        setUser(copiedUser);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchLogIn(user).then(savedUser => {
            if(savedUser !== undefined && savedUser.username) {
                setUser({
                    username:"",
                    password:""
                })
                console.log("Logging in!");
                navigate('/chat');
            }
        })
    }

    return(
        <div className="login-container">
            <div className="login">
                <form onSubmit={handleSubmit}>
                    {loggedInUser !== undefined && loggedInUser.message ?
                    <p className="display">{loggedInUser.message}</p>
                    :
                    <p className="hidden"></p>
                    }
                    <h2>Log In</h2>
                    <label htmlFor="username">Username or Email:</label>
                    <input type="text" id="login-username" name="username" placeholder="Username or Email" 
                    value={user.username} onChange={handleChange}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="login-password" name="password" placeholder="Password" 
                    value={user.password} onChange={handleChange}/>

                    <input id="login-btn" type="submit" value="Login" />

                    <Link to="signup">
                        <p>Sign up</p>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;