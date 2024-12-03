import { createContext, useContext, useState, useEffect, Children } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect (() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await getCurrentUser();
            console.log('User data from checkAuth:', userData);
            
            if (userData) {
                setIsLoggedIn(true);
                setUser(userData);
            } else {
                console.log('No user data found, clearing state');
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.log('Auth check error:', error.message);
            // Only clear the state if it's an authentication error
            if (error.code === 401 || error.message.includes('auth')) {
                setIsLoggedIn(false);
                setUser(null);
            }
            // Otherwise, keep the current state
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlobalContext.Provider
        value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
            checkAuth
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;