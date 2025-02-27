import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginPage from "./pages/auth/LoginPAge";
import JobListingPage from "./pages/public/JobListingPage";
import RegisterPage from "./pages/auth/RegisterPage";

// import GalleryPage from "./pages/GalleryPage";Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/public" element={<Dashboard />}>
          <Route path="job-listings" element={<JobListingPage />} />
          {/* <Route
            path="vendor-organization"
            element={<VendorOrganizationsPage />}
          />
          <Route path="category" element={<CategoriesPage />} />
          <Route path="job-description" element={<JobDescriptionsPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="profile" element={<ProfilesPage />} /> */}
        </Route>
        <Route path="/admin" element={<Dashboard />}>
          <Route path="job-listings" element={<JobListingPage />} />
          {/* <Route
            path="vendor-organization"
            element={<VendorOrganizationsPage />}
          />
          <Route path="category" element={<CategoriesPage />} />
          <Route path="job-description" element={<JobDescriptionsPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="profile" element={<ProfilesPage />} /> */}
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
