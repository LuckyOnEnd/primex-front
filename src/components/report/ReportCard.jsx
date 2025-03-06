import React from "react";
import { Typography } from "@material-tailwind/react";

export function ReportCard({ label, value }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-md">
            <Typography variant="h6" className="mb-2 text-lg font-semibold">{label}</Typography>
            <Typography className="text-xl font-bold">
                {value >= 0 ? `+${value}` : `${value}`}
            </Typography>
        </div>
    );
}
