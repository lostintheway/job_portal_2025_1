import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    // Process the filename
    let filename = path.parse(file.originalname).name;

    // Remove special characters and replace spaces with underscores
    filename = filename.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");

    // Truncate to 10 characters if longer
    if (filename.length > 10) {
      filename = filename.substring(0, 10);
    }

    // Add milliseconds to the front for uniqueness
    filename = Date.now() + "_" + filename;

    // Add file extension
    filename += path.extname(file.originalname);

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Handle POST request to /upload
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Construct the URL (adjust based on your server setup)
    const url = `images/${req.file.filename}`;

    res.json({ url: url });
  }
);

export default router;
