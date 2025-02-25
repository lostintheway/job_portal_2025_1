import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import VendorOrganizationsPage from "./pages/VendorOrganizationsPage";
import CategoriesPage from "./pages/CategoriesPage";
import JobDescriptionsPage from "./pages/JobDescriptionsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilesPage from "./pages/ProfilesPage";
// import GalleryPage from "./pages/GalleryPage";Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Dashboard />}>
          <Route path="application" element={<ApplicationsPage />} />
          <Route
            path="vendor-organization"
            element={<VendorOrganizationsPage />}
          />
          <Route path="category" element={<CategoriesPage />} />
          <Route path="job-description" element={<JobDescriptionsPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="profile" element={<ProfilesPage />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
