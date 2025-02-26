import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import AuthPage from "./pages/auth/AuthPage";
import JobListingPage from "./pages/jobs/JobListingPage";

// import GalleryPage from "./pages/GalleryPage";Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
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

        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
