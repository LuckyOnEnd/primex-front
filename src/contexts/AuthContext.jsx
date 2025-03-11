import React, { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (values) => {
        try {
            const response = await fetch("http://localhost:8000/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
