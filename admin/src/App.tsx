import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import JobListingPage from "./pages/public/JobListingPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import JobSeekerDashboard from "./pages/public/JobSeekerDashboard";
import JobSearchPage from "./pages/public/JobSearchPage";
import ApplicationManagementPage from "./pages/public/ApplicationManagementPage";
import JobDetailPage from "./pages/public/JobDetailPage";
import JobSeekerProfilePage from "./pages/public/JobSeekerProfilePage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostedJobsPage from "./pages/employer/PostedJobsPage";
import CreateJobPage from "./pages/employer/CreateJobPage";
import ApplicationsPage from "./pages/employer/ApplicationsPage";

// import GalleryPage from "./pages/GalleryPage";Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/public" element={<Dashboard role="jobseeker" />}>
          <Route path="dashboard" element={<JobSeekerDashboard />} />
          <Route path="jobs" element={<JobSearchPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="applications" element={<ApplicationManagementPage />} />
          <Route path="profile" element={<JobSeekerProfilePage />} />
          <Route path="bookmarks" element={<JobListingPage />} />
        </Route>
        <Route path="/employer" element={<Dashboard role="employer" />}>
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="job-postings" element={<PostedJobsPage />} />
          <Route path="create-job" element={<CreateJobPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="company-profile" element={<JobSeekerProfilePage />} />
        </Route>
        <Route path="/admin" element={<Dashboard role="admin" />}>
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="users" element={<JobListingPage />} />
          <Route path="job-listings" element={<JobListingPage />} />
          <Route path="settings" element={<JobSeekerProfilePage />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
