import { Router } from "express";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolios,
} from "../controllers/portfolioController";
import { authenticateToken } from "../middlewares/authMiddleware";

const portfolioRoutes = Router();

portfolioRoutes.post("/", authenticateToken, createPortfolio);
portfolioRoutes.delete("/:id", authenticateToken, deletePortfolio);

portfolioRoutes.get("/", getPortfolios);

export default portfolioRoutes;
