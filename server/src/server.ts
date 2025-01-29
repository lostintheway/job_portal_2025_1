import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { createTablesOnStartup } from "./config/db";

const app = express();

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

//server uploads folder
app.use("/images", express.static("uploads"));

createTablesOnStartup();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
