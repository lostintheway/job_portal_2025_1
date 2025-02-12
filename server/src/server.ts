import express, { Application, Request, Response } from "express";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import vendorOrganizationRoutes from "./routes/vendorOrganization.routes";
import categoryRoutes from "./routes/category.routes";
import jobDescriptionRoutes from "./routes/jobDescription.routes";
import applicationRoutes from "./routes/application.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import cors from "cors";

const app: Application = express();

const PORT = process.env.PORT || 5222;

const allowedDomains = ["http://localhost:3000", "http://localhost:3005"]; // Replace with your domains

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedDomains.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json()); // for parsing application/json

// Use routes
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/vendor-organizations", vendorOrganizationRoutes);
app.use("/categories", categoryRoutes);
app.use("/job-descriptions", jobDescriptionRoutes);
app.use("/applications", applicationRoutes);
app.use("/bookmarks", bookmarkRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Job Application System API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
