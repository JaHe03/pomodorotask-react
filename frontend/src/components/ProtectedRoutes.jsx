import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoutes({ children }) {
    const [isAuthorized, setisAuthorized] = useState(null);


    useEffect(() => {
        auth().catch(() => setisAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{    
            const response = await api.post("api/auth/token/refresh/",{
                refresh: refreshToken,
            });
            if (response.status === 200){
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setisAuthorized(true);
            } else {
                setisAuthorized(false);
            }
        }
        catch(error){
            console.error("Error refreshing token:", error);
            setisAuthorized(false);
        }
    };

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken){
            setisAuthorized(false);
            return
        }
        const decoded = jwtDecode(accessToken);
        const tokenExp = decoded.exp;
        const now = Date.now() / 1000;
        
        if (tokenExp < now){
            await refreshToken();
        } else {
            setisAuthorized(true);
        }
    }

    if (isAuthorized === null)
        return <div>loading...</div>

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;