import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"
import { Message } from "../components/index.js"

export default function HomePage() {
  const [symbolData, setSymbolData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState({
    api_key: '',
    api_sec: '',
    type: '',
    amount: '',
    signal_type: '',
    trading_view_login: '',
    trading_view_password: '',
    trading_view_chart_link: ''
  });
  const [isEdited, setIsEdited] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const role = localStorage.getItem("role")
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/api/getkeys", {
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
          setOriginalData(result.result);
        }
      } catch (error) {
        console.log("Error:", error.message);
        if (error.message === "Unauthorized access - 401") {
          navigate("/auth");
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("connect", () => console.log("Socket.IO connection established"));
    socket.on("data", (data) => setSymbolData(data.data));
    socket.on("error", (error) => console.error("Socket.IO error:", error));
    socket.on("disconnect", () => console.log("Socket.IO connection closed"));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData((prevData) => {
      const updatedData = {...prevData, [name]: value};
      setIsEdited(JSON.stringify(updatedData) !== JSON.stringify(originalData));
      return updatedData;
    });
  };

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };

  const handleCancelClick = () => {
    setData(originalData);
    setIsEditable(false);
  };

  const handleSaveClick = () => {
    setOriginalData(data);
    setIsEditable(false);
    setIsEdited(false);

    const token = localStorage.getItem("token");

    const apiUrl = "http://localhost:8000/api/postkey";
    console.log(data);
    console.log(data.signal_type);
    
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        api_key: data.api_key,
        api_sec: data.api_sec,
        signal_type: data.signal_type,
        trading_view_login: data.trading_view_login,
        trading_view_password: data.trading_view_password,
        trading_view_chart_link: data.trading_view_chart_link,
        amount: data.amount,
        type: data.type,
      }),
    })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw err;
            });
          }
          return response.json();
        })
        .then((originalData) => {
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
          let errorMessage = '';
          if (error.error) {
            Object.keys(error.error).forEach((key) => {
              errorMessage += `${error.error[key].join(', ')}\n`;
            });
          } else {
            errorMessage = error.message || 'An error occurred';
          }

          setAlert({
            message: "Error",
            description: errorMessage,
            type: "error",
          });

          setData(originalData);
        });
  };

  const handleCloseAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/close_positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error("Failed to close orders");
      }

      const result = await response.json();
      setAlert({
        message: "Success",
        description: "All orders closed successfully",
        type: "success",
      });

    } catch (error) {
      setAlert({
        message: "Error",
        description: error.message || "Failed to close orders",
        type: "error",
      });
    }
  };

  const renderField = (field, label) => {
    if (role !== 'vip' && field === 'signal_type') {
      return null;
    }

    if (role === 'essential' && (field === 'trading_view_login' || field === 'trading_view_password' || field === 'trading_view_chart_link')) {
      return null;
    }
  

    return (
      <div className="flex flex-wrap items-center w-full mb-2">
        <Typography variant="h5" className="mr-4 w-1/4 min-w-[100px] text-sm">
          {label}:
        </Typography>
        <div className="flex-1 min-w-[200px]">
          {field === "type" || field === "signal_type" ? (
            isEditable ? (
              <select
                name={field}
                value={data[field]}
                onChange={handleChange}
                className="w-full text-gray-800 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {field === "type" ? (
                  <>
                    <option value="spot">spot</option>
                    <option value="future">future</option>
                  </>
                ) : (
                  <>
                    <option value="manual">Manual</option>
                    <option value="server">From Server</option>
                  </>
                )}
              </select>
            ) : (
              <span className="block w-full text-gray-800 px-2 py-1 text-sm border rounded-lg overflow-hidden whitespace-nowrap text-ellipsis">
                {data[field] || `No ${label} provided`}
              </span>
            )
          ) : (
            isEditable ? (
              <input
                type="text"
                name={field}
                value={data[field]}
                onChange={handleChange}
                className="w-full text-gray-800 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            ) : (
              <span className="block w-full text-gray-800 px-2 py-1 text-sm border rounded-lg overflow-hidden whitespace-nowrap text-ellipsis">
                {data[field] || `No ${label} provided`}
              </span>
            )
          )}
        </div>
      </div>
    );
  };
  

  return (
      <div className="flex flex-col gap-16 p-4 sm:p-8">
        <Card className="w-full bg-white text-black">
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {renderField('api_key', 'Api Key')}
              {renderField('api_sec', 'Secret Key')}
              {renderField('type', 'Trade Type')}
              {renderField('amount', 'Amount')}
              {renderField('signal_type', 'Signal Type')}
              {renderField('trading_view_login', 'Trading View Login')}
              {renderField('trading_view_password', 'Trading View Password')}
              {renderField('trading_view_chart_link', 'Chart Link')}
            </div>
          </CardBody>

          <CardFooter className="pt-0 text-center flex justify-center gap-4">
            {!isEditable ? (
                <>
                  <Button
                      onClick={handleEditClick}
                      size="md"
                      className="rounded-full"
                  >
                    Edit
                  </Button>
                  <Button
                      onClick={handleCloseAllOrders}
                      size="md"
                      className="rounded-full bg-red-500 hover:bg-red-600"
                  >
                    Close All Orders
                  </Button>
                </>
            ) : (
                <>
                  <Button
                      onClick={handleCancelClick}
                      size="md"
                      className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                      onClick={handleSaveClick}
                      size="md"
                      className="rounded-full"
                  >
                    Save Changes
                  </Button>
                  <Button
                      onClick={handleCloseAllOrders}
                      size="md"
                      className="rounded-full bg-red-500 hover:bg-red-600"
                  >
                    Close All Orders
                  </Button>
                </>
            )}
          </CardFooter>
        </Card>

        <Card className="w-full bg-white text-black">
          <CardHeader
              className="grid h-14 place-items-center rounded-full bg-gradient-to-r from-[#B4B8BB] via-[white] to-[#B4B8BB]">
            <Typography className="text-lg sm:text-xl font-sans">Logs</Typography>
          </CardHeader>
          <CardBody>
            {symbolData.length > 0 ? (
                <Card className="overflow-hidden bg-transparent">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Index</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Symbol</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Signal</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Price</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Type</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Time</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">Commission</th>
                        <th className="border border-gray-700 px-4 py-2 text-black font-bold">PNL</th>
                      </tr>
                      </thead>
                      <tbody>
                      {symbolData
                          .slice()
                          .reverse()
                          .map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 text-gray-600 hover:text-black">
                                <td className="border border-gray-700 px-4 py-2 font-medium">{symbolData.length - index}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.Symbol || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.Signal || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.Price || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.type || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.Time || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">{item.commission || "Loading..."}</td>
                                <td className="border border-gray-700 px-4 py-2 font-medium">
                                  {item.realized_pnl === null ? "Loading..." : item.realized_pnl}
                                </td>
                              </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
            ) : (
                <Typography className="text-gray-800 text-center">No logs data available</Typography>
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
}
