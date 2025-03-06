import React from "react";
import {FaHome, FaCogs, FaSignOutAlt, FaFileAlt} from "react-icons/fa";
import { List, ListItem, ListItemPrefix, Card } from "@material-tailwind/react";
import { useNavigate } from "react-router";

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
      <Card className="hidden sm:block w-64 h-screen bg-gradient-to-b from-[#B4B8BB] via-[white] to-[#B4B8BB] text-black shadow-lg rounded-r-2xl rounded-l-none">
        <div className="px-3 pb-3 pt-8">
          <p className="mt-2 text-lg font-bold tracking-tight text-center text-black">
            Dashboard
          </p>

          <List className="mt-6">
            <ListItem
                className="hover:bg-gray-800 rounded-lg"
                onClick={() => navigate("/home")}
            >
              <ListItemPrefix>
                <FaHome className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-400">Home</a>
            </ListItem>

            <ListItem
                className="hover:bg-gray-800 rounded-lg"
                onClick={() => navigate("/settings")}
            >
              <ListItemPrefix>
                <FaCogs className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-400">Settings</a>
            </ListItem>

            <ListItem
                className="hover:bg-gray-800 rounded-lg"
                onClick={() => navigate("/report")}
            >
              <ListItemPrefix>
                <FaFileAlt className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-400">Report</a>
            </ListItem>


            <ListItem
                className="hover:bg-gray-800 rounded-lg"
                onClick={handleLogout}
            >
              <ListItemPrefix>
                <FaSignOutAlt className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-400">Logout</a>
            </ListItem>
          </List>
        </div>
      </Card>
  );
}

export default SideBar;
