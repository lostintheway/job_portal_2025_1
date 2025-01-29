import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  createGallery,
  deleteGallery,
  getGalleries,
} from "../controllers/galleryController";

const galleryRoutes = Router();

galleryRoutes.post("/", authenticateToken, createGallery);
galleryRoutes.delete("/:id", authenticateToken, deleteGallery);

galleryRoutes.get("/", getGalleries);

export default galleryRoutes;
