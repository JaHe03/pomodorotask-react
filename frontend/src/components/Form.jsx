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
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
          {/* Form Container */}
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-96">
            
            {/* App Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              PomodoroTasks
            </h1>
      
            {/* Form Mode (Login/Register) */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              {methodName}
            </h2>
      
            {/* Username Input */}
            <input
              className="rounded-xl p-2 w-full mb-3 border border-gray-300 focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
      
            {/* Email Input (Only for Register) */}
            {method === "register" && (
              <input
                className="rounded-xl p-2 w-full mb-3 border border-gray-300 focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
      
            {/* Password Input */}
            <input
              className="rounded-xl p-2 w-full mb-4 border border-gray-300 focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
      
            {/* Submit Button */}
            <button
              className="rounded-xl p-2 w-full mb-3 bg-gray-900 text-white font-semibold hover:bg-gray-700"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : methodName}
            </button>
      
            {/* Toggle Login/Register Button */}
            <button
              className="rounded-xl p-2 w-full text-gray-600 font-semibold border border-gray-400 hover:bg-gray-100"
              type="button"
              onClick={() => navigate(method === "login" ? "/register" : "/login")}
            >
              {methodName === "Login" ? "Register" : "Login"}
            </button>
          </form>
        </div>
      );
}

export default Form;