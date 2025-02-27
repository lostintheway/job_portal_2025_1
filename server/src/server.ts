import express from "express";
import type { Application, Request, Response } from "express";
import userRoutes from "./routes/user.routes.ts";
import categoryRoutes from "./routes/category.routes.ts";
import applicationRoutes from "./routes/application.routes.ts";
import bookmarkRoutes from "./routes/bookmark.routes.ts";
import jobListingRoutes from "./routes/jobListing.routes.ts";
// import JobSeekerProfileRoutes from "./routes/";

import cors from "cors";

const app: Application = express();

const PORT = process.env.PORT || 5222;

const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:3005",
  "http://localhost:5222",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3005",
  "http://127.0.0.1:5222",
];

// Configure CORS middleware with more detailed options
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedDomains.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      callback(new Error(`CORS Error: Origin ${origin} is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json()); // for parsing application/json

// Use routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/job-descriptions", jobListingRoutes);
app.use("/applications", applicationRoutes);
app.use("/bookmarks", bookmarkRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Job Application System API is running!");
});
app.get("/test", (req: Request, res: Response) => {
  res.send("Test Job Application System API is running!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
