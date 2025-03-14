import { Card } from "@material-tailwind/react"
import { Button, Form, Input } from "antd"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Message } from "../components/index.js"

const AuthPage = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);

    const onFinish = (values) => {
        const apiUrl = "http://localhost:8000/api/auth";

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.subscription_type)
                    setAlert({ message: "Success", description: "Login successful", type: "success" });
                    setTimeout(() => navigate("/"), 200);
                } else {
                    throw new Error("Invalid credentials");
                }
            })
            .catch((error) => {
                setAlert({ message: "Error", description: "Invalid credentials", type: "error" });
            });
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        window.open("https://primexalgo.com/signup.html", "_blank");
    };

    const onFinishFailed = (errorInfo) => {
        setAlert({ message: "Error", description: "Form validation failed", type: "error" });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
                <Form
                    name="auth"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="space-y-4"
                >
                    <Form.Item
                        label={<span className="block text-black">User ID</span>}
                        name="user_id"
                        rules={[{ required: true, message: "Please input your User ID!" }]}
                    >
                        <Input
                            className="p-2 border-gray-300 w-full"
                            style={{ width: "250px", marginLeft: "13px" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="block text-black">Password</span>}
                        name="password"
                        rules={[{ required: true, message: "Please input your Password!" }]}
                    >
                        <Input.Password
                            className="p-2 border-gray-300 w-full"
                            style={{ width: "250px" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-black text-white"
                            style={{ width: "100%" }}
                        >
                            Login
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="default"
                            onClick={handleSignUpClick}
                            className="w-full"
                            style={{ width: "100%" }}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {alert && (
                <Message
                    message={alert.message}
                    description={alert.description}
                    type={alert.type}
                    placement="topRight"
                />
            )}
        </div>
    );
};

export default AuthPage;
