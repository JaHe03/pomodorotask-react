import { useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const methodName = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password || (method === "register" && !email)) {
            alert("Please fill out all fields!");
            return;
        }

        setLoading(true);

        try {
            const payload = method === "login" ? { username, password } : { username, password, email };
            const res = await api.post(route, payload);

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } 
        catch (error) {
            alert("Error submitting form:",  + (error.response?.data?.detail || error.message));
        } 
        finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{methodName}</h1>

            <input className="form-input"
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />

            {method === "register" && (
                <input className="form-input"
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
            )}

            <input className="form-input"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
            />
        
            <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Processing..." : methodName}
            </button>
        </form>
    );
}

export default Form;