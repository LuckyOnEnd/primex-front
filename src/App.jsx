import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomeLayout from "./layout/HomeLayout";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import AuthPage from "./pages/AuthPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
function App() {
  return (
      <div className="bg-[#F4F5F5]">
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>
        </Routes>
      </div>
  );
}

export default App;
