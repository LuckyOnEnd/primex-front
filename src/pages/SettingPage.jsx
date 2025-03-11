import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react"
import { Form, Input, Radio } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Message } from "../components"

const SettingPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [alert, setAlert] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const role = localStorage.getItem('role')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://api.primexalgo.com/api/getkeys", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (response.status === 401) {
          throw new Error("Unauthorized access - 401");
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          const result = await response.json();
          setData(result.result);
        }
      } catch (error) {
        console.log("Error:", error.message);
        if (error.message === "Unauthorized access - 401") {
          navigate("/auth");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const onFinish = (values) => {
    console.log("Success:", values);

    const token = localStorage.getItem("token");

    const apiUrl = "https://api.primexalgo.com/api/postkey";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })
        .then((response) => response.json())
        .then((data) => {
          setAlert({
            message: "Success",
            description: "API Key added successfully",
            type: "success",
          });

          setTimeout(() => {
            navigate('/');
          }, 2000);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/auth");
            return;
          }
          setAlert({
            message: "Error",
            description: error.message,
            type: "error",
          });
        });
  };

  const onFinishFailed = (errorInfo) => {
    setAlert({
      message: "Error",
      description: errorInfo,
      type: "error",
    });
  };

  const handleManageKeysClick = () => {
    setData({
      api_key: "",
      api_sec: "",
      type: "",
      amount: 0,
      signal_type: "",
      trading_view_login: "",
      trading_view_password: "",
      trading_view_chart_link: ""
    });
  };

  const handleNotification = () => {
    console.log("Setting notification");
    setShowNotification(true);
  };

  return (
      <div className="flex flex-col gap-4 overflow-hidden mt-4">
        <Card className="w-full bg-white text-black mt-10">
          <CardHeader
              variant="gradient"
              color="white"
              className="h-16 flex flex-col justify-center items-center rounded-full bg-gradient-to-r from-[#B4B8BB] via-[white] to-[#B4B8BB]"
          >
            <Typography color="black" className="text-lg sm:text-xl font-sans">
              Keys Management
            </Typography>
            <Typography
                color="black"
                className="text-sm sm:text-[16px] font-sans text-gray-600"
            >
              For trading please input your credentials
            </Typography>
          </CardHeader>
          <CardBody className="flex justify-center items-center">
            {Object.keys(data).length === 0 ? (
                <div className="flex justify-center items-center">
                  <Button
                      type="primary"
                      onClick={handleManageKeysClick}
                      className="text-white bg-black"
                  >
                    Manage Keys
                  </Button>
                </div>
            ) : (
                <div className="mt-5 text-black w-full sm:w-1/2">
                  <Form
                      name="basic"
                      labelCol={{
                        span: 8,
                      }}
                      wrapperCol={{
                        span: 16,
                      }}
                      style={{
                        maxWidth: "100%",
                      }}
                      initialValues={{
                        api_key: data.api_key,
                        api_sec: data.api_sec,
                        type: data.type,
                        amount: data.amount,
                        signal_type: data.signal_type,
                        trading_view_login: data.trading_view_login,
                        trading_view_password: data.trading_view_password,
                        trading_view_chart_link: data.trading_view_chart_link,
                      }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                  >
                    <Form.Item
                        label={<span className="text-black">Api_key</span>}
                        name="api_key"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Binance Api_key!",
                          },
                        ]}
                    >
                      <Input className="p-2 border-black" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-black">Secret_key</span>}
                        name="api_sec"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Binance Secret!",
                          },
                        ]}
                    >
                      <Input className="p-2 border-black" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-black">Amount</span>}
                        name="amount"
                        rules={[
                          {
                            required: true,
                            message: "Please write amount",
                          },
                          {
                            validator: (_, value) => {
                              if (value && value < 500) {
                                return Promise.reject(new Error("Amount must be at least 500"));
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                    >
                      <Input className="p-2 border-black" />
                    </Form.Item>
                    
                    <Form.Item
                        label={<span className="text-black">Trade Type</span>}
                        name="type"
                    >
                      <Radio.Group className="text-black">
                        <Radio value="spot" className="text-black">
                          Spot
                        </Radio>
                        <Radio value="future" className="text-black">
                          Future
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    {role === 'role' && (
                       <Form.Item
                       label={<span className="text-black">Signal Type</span>}
                       name="signal_type"
                       >
                        <Radio.Group className="text-black">
                          <Radio value="server" className="text-black">
                            From Server
                          </Radio>
                          <Radio value="manual" className="text-black">
                            Manual
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}
                   {role !== 'essential' && (
                    <>
                      <Form.Item
                          label={<span className="text-black">TradingView Id</span>}
                          name="trading_view_login"
                          rules={[
                            {
                              required: true,
                              message: "Please input your TradingView Id",
                            },
                          ]}
                      >
                        <Input className="p-2 border-black" />
                      </Form.Item>

                      <Form.Item
                          label={<span className="text-black">TradingView Password</span>}
                          name="trading_view_password"
                          rules={[
                            {
                              required: true,
                              message: "Please input your TradingView Password",
                            },
                          ]}
                      >
                        <Input className="p-2 border-black" />
                      </Form.Item>

                      <Form.Item
                          label={<span className="text-black">TradingView Chart link</span>}
                          name="trading_view_chart_link"
                          rules={[
                            {
                              required: true,
                              message: "Please input Chart link",
                            },
                          ]}
                      >
                        <Input className="p-2 border-black" />
                      </Form.Item>
                      </>
                   )}

                    <Form.Item label={null}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>

                </div>
            )}
          </CardBody>
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

export default SettingPage;