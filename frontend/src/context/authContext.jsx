import React, { createContext, useState } from "react";

export const authContext = createContext()

const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});

    return (
        <authContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export default AuthContextProvider