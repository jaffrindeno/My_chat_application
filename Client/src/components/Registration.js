import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "./Registration.css";

function Registration() {
    const navigate = useNavigate();

    const {addUser} = useContext(UserContext);

    const [newUser, setNewUser] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const [match, setMatch] = useState(false);

    function handleChange(event){
        const name = event.target.name;
        const updatedUser = {...newUser}
        updatedUser[name] = event.target.value;
        setNewUser(updatedUser);
    }

    function handleSubmit(event){
        event.preventDefault();
        if (match) {
            addUser(newUser);
            setMatch(false);
            setNewUser({
                username:"",
                email:"",
                password:"",
                confirmPassword:""
            });
            navigate("/");
        }
    }

    function checkPassword(){
        if(newUser.password === newUser.confirmPassword) {
            setMatch(true);
        } else {
            setMatch(false);
        }
    }

    return(
        <div className="signup-container">
            <div className="signup">
                <form onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    <label htmlFor="Email">Email:</label>
                    <input id="email" name="email" type="email" value={newUser.email}
                    required placeholder="Email" onChange={handleChange}/>

                    <label htmlFor="Username">Username:</label>
                    <input id="username" name="username" type="text" value={newUser.username}
                    required placeholder="Username" onChange={handleChange}/>

                    <label htmlFor="Password">Password:</label>
                    <input id="password" name="password" type="password" value={newUser.password}
                    required placeholder="Password" minLength="1" onChange={handleChange}/>

                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input id="confirm_password" name="confirmPassword" type="password" value={newUser.confirmPassword}
                    required placeholder="Confirm Password" minLength="1" onChange={handleChange} onKeyUp={checkPassword}/>
                    { newUser.confirmPassword !== "" ?
                        <div className="pwd-message">
                            {match? <p>Passwords match ✅</p> : <p>Passwords don't match ❌</p>}
                        </div>
                        :<p className="hidden"></p>
                    }
                    <input id="create-account-btn" type="submit" value="Create account" 
                    disabled={newUser.confirmPassword !=="" && match? false : true}/>

                    <Link to="/">
                        <p>Log in</p>
                    </Link>

                </form>
            </div>
        </div>
    );
}

export default Registration;