import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import GalleryPage from "./pages/GalleryPage";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobPage from "./pages/JobPage";
import CompanyPage from "./pages/CompanyPage";
import ApplicationPage from "./pages/ApplicationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Dashboard />}>
          <Route path="application" element={<ApplicationPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="job" element={<JobPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
