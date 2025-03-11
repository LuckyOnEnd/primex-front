import { Route, Routes } from "react-router-dom"
import "./App.css"
import HomeLayout from './layout/HomeLayout.jsx'
import AuthPage from "./pages/AuthPage.jsx"
import HomePage from "./pages/HomePage"
import ReportPage from "./pages/ReportPage.jsx"
import SettingPage from "./pages/SettingPage"
function App() {
  return (
    <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Route>
    </Routes>
  );
}

export default App;
