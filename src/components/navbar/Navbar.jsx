import React, { useState } from "react";
import { FaHome, FaCogs, FaBars } from "react-icons/fa";
import { List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { useNavigate } from "react-router";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sm:hidden rounded-b-xl transition-all bg-gradient-to-b from-[#B4B8BB] via-[white] to-[#B4B8BB] text-black">
      <nav className="text-black shadow-md p-4 flex justify-between items-center">
        <p className="text-lg font-bold tracking-tight">Dashboard</p>
        <button
          className="text-xl text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="text-black shadow-lg rounded-b-xl">
          <List>
            <ListItem
              className="hover:bg-gray-800 rounded-lg"
              onClick={() => navigate("/home")}
            >
              <ListItemPrefix>
                <FaHome className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-800">Home</a>
            </ListItem>

            <ListItem
              className="hover:bg-gray-800 rounded-lg"
              onClick={() => navigate("/settings")}
            >
              <ListItemPrefix>
                <FaCogs className="text-black text-xl" />
              </ListItemPrefix>
              <a className="text-black hover:text-gray-800">Settings</a>
            </ListItem>
          </List>
        </div>
      )}
    </div>
  );
}

export default Navbar;
