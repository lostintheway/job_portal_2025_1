import express from "express";
import ApplicationController from "../controllers/application.controller";

const router = express.Router();

// GET /api/applications - Get all applications
router.get("/", ApplicationController.getAllApplications);

// GET /api/applications/:applicationId - Get application by ID
router.get("/:applicationId", ApplicationController.getApplicationById);

// POST /api/applications - Create a new application
router.post("/", ApplicationController.createApplication);

// PUT /api/applications/:applicationId - Update an application
router.put("/:applicationId", ApplicationController.updateApplication);

// DELETE /api/applications/:applicationId - Delete an application
router.delete("/:applicationId", ApplicationController.deleteApplication);

export default router;
