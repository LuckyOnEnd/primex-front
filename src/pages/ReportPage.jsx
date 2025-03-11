import { Listbox } from "@headlessui/react"
import { Button } from "@material-tailwind/react"
import React, { useEffect, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { Message } from "../components/index.js"

export default function ReportPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("Today");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [alert, setAlert] = useState(null);
    const [reportData, setReportData] = useState({
        total_loss: 0,
        total_profit: 0,
        total_commission: 0,
        net_profit: 0,
    });
    const [reportGenerated, setReportGenerated] = useState(false);

    const periods = [
        "Today",
        "Current week",
        "Last week",
        "Current month",
        "Last month",
        "Range",
    ];

    const stats = [
        { title: "Total Loss", value: reportData.total_loss, color: "bg-red-500" },
        { title: "Total Profit", value: reportData.total_profit, color: "bg-green-500" },
        { title: "Total Commission", value: reportData.total_commission, color: "bg-blue-500" },
        { title: "Net Profit", value: reportData.net_profit, color: "bg-yellow-500" },
    ];

    const generate = (values) => {
        const token = localStorage.getItem("token");
        const apiUrl = "http://localhost:8000/api/report";

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
                if (data.success) {
                    setReportData({
                        total_loss: data.data.total_loss,
                        total_profit: data.data.total_profit,
                        total_commission: data.data.total_commission,
                        net_profit: data.data.net_profit,
                    });
                    setAlert({
                        message: "Success",
                        description: "Report generated successfully",
                        type: "success",
                    });
                    setReportGenerated(true);
                } else {
                    setAlert({
                        message: "Error",
                        description: data.message || "Unknown error",
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                setAlert({
                    message: "Error",
                    description: error.message,
                    type: "error",
                });
            });
    };

    const getStartOfWeek = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day;
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek;
    };

    const getEndOfWeek = (date) => {
        const endOfWeek = new Date(date);
        const day = endOfWeek.getDay();
        const diff = endOfWeek.getDate() + (6 - day);
        endOfWeek.setDate(diff);
        endOfWeek.setHours(23, 59, 59, 999);
        return endOfWeek;
    };

    const getStartOfMonth = (date) => {
        const startOfMonth = new Date(date);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return startOfMonth;
    };

    const getEndOfMonth = (date) => {
        const endOfMonth = new Date(date);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);
        return endOfMonth;
    };

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const prepareAndGenerateReport = () => {
        const currentDate = new Date();
        let start, end;

        if (selectedPeriod === "Today") {
            start = new Date(currentDate.setHours(0, 0, 0, 0));
            end = new Date(currentDate.setHours(23, 59, 59, 999));
        } else if (selectedPeriod === "Current week") {
            start = new Date(getStartOfWeek(currentDate));
            end = new Date(getEndOfWeek(currentDate));
        } else if (selectedPeriod === "Last week") {
            const lastWeek = new Date(currentDate);
            lastWeek.setDate(currentDate.getDate() - 7);
            start = new Date(getStartOfWeek(lastWeek));
            end = new Date(getEndOfWeek(lastWeek));
        } else if (selectedPeriod === "Current month") {
            start = new Date(getStartOfMonth(currentDate));
            end = new Date();
        } else if (selectedPeriod === "Last month") {
            const lastMonth = new Date(currentDate);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            start = new Date(getStartOfMonth(lastMonth));
            end = new Date(getEndOfMonth(lastMonth));
        } else if (selectedPeriod === "Range") {
            if (isValidDate(startDate) && isValidDate(endDate)) {
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                if (end < start) {
                    setAlert({
                        message: "Error",
                        description: "End date cannot be earlier than start date",
                        type: "error",
                    });
                    return;
                }
            } else {
                setAlert({
                    message: "Error",
                    description: "Invalid date range selected",
                    type: "error",
                });
                return;
            }
        }

        const requestData = {
            from_date: start.toISOString(),
            to_date: end.toISOString(),
        };

        generate(requestData);
    };

    useEffect(() => {
        prepareAndGenerateReport();
    }, []);

    useEffect(() => {
        if (selectedPeriod !== "Range") {
            prepareAndGenerateReport();
        }
    }, [selectedPeriod]);

    const handleGenerateClick = () => {
        if (selectedPeriod === "Range") {
            prepareAndGenerateReport();
        }
    };

    const formatValue = (value) => {
        if (value > 0) {
            return `+${value} USDT`;
        } else if (value < 0) {
            return `${value} USDT`;
        } else {
            return `${value} USDT`;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="mb-6 w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                    <Listbox value={selectedPeriod} onChange={setSelectedPeriod}>
                        <div className="relative w-full sm:w-48">
                            <Listbox.Button className="p-2 border rounded-md bg-white shadow-md w-full text-left">
                                {selectedPeriod}
                            </Listbox.Button>
                            <Listbox.Options className="absolute mt-2 w-full bg-white border rounded-md shadow-lg z-10">
                                {periods.map((period, index) => (
                                    <Listbox.Option
                                        key={index}
                                        value={period}
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                    >
                                        {period}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                    {selectedPeriod === "Range" && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 w-full">
                            <input
                                type="date"
                                className="p-2 border rounded-md w-full sm:w-auto"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="p-2 border rounded-md w-full sm:w-auto"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                            />
                            <Button
                                type="primary"
                                onClick={handleGenerateClick}
                                className="w-full sm:w-auto"
                            >
                                Generate
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {reportGenerated && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl shadow-lg bg-white text-black`}
                        >
                            <h3 className="text-lg font-semibold">{stat.title}</h3>
                            <p
                                className={`text-2xl font-bold mt-2 ${
                                    stat.value < 0
                                        ? "text-red-500"
                                        : stat.value === 0
                                            ? "text-black"
                                            : "text-green-500"
                                }`}
                            >
                                {formatValue(stat.value)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
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