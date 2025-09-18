import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // update user data 
    const updateUser = (userData) => {
        setUser(userData);
    };

    // clear user data(e.g. logout)
    const clearUser = () => { setUser(null) };

    // Fetch user data from the server if a token exists
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                updateUser(response.data.user);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                // Clear the token if fetching the user fails,
                // as the token might be invalid or expired.
                localStorage.clear();
                clearUser();
            }
        };

        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;