import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import swaggerAutogen from "swagger-autogen";

const app = express();

const doc = {
  info: {
    title: "Express API",
    description: "Auto-generated Swagger documentation",
  },
  host: "localhost:3000", // update if needed
  schemes: ["http"],
  // You can add security definitions, servers, etc.
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./routes/applicationRoutes.ts",
  "./routes/authRoutes.ts",
  "./routes/companyRoutes.ts",
  "./routes/jobRoutes.ts",
  "./routes/userRoutes.ts",
]; // or point to your routes files

// swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
//   console.log("Swagger documentation has been generated.");
// });

if (process.env.NODE_ENV !== "production") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerFile = require("./swagger-output.json");
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

// Define allowed domains
const allowedDomains = ["http://localhost:3000", "http://localhost:3005"]; // Replace with your domains

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedDomains.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
