import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URI = 'http://localhost:5000'; // process.env.REACT_APP_API_URI;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(true);
    
    const navigate = useNavigate();
    const {login} = useAuth();

    const toggleLogin = async (e) => {  
        setLoggingIn(!loggingIn);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const endpoint = loggingIn ? '/login' : '/register';
            const res = await axios.post(`${API_URI}${endpoint}`, {username, password});
            
            login(res.data.token);
            navigate('/tickets');
        } catch (err) {
            console.log("Error: " + err);
        }
    };
    return (
        <div>
            <h2>{loggingIn ? 'Login to an existing account' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {loggingIn ? 'Login' : 'Register'}
                </button>
            </form>
            <button onClick={toggleLogin}>
                {loggingIn ? 'Register Instead' : 'Login to an existing account'}
            </button>
        </div>
    );
};

export default Login;