import express from "express";
import userRoutes from "./user.routes";
import profileRoutes from "./profile.routes";
import vendorOrganizationRoutes from "./vendorOrganization.routes";
import categoryRoutes from "./category.routes";
import jobDescriptionRoutes from "./jobDescription.routes";
import applicationRoutes from "./application.routes";
import bookmarkRoutes from "./bookmark.routes";

const router = express.Router();

// Mount routes
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/vendor-organizations", vendorOrganizationRoutes);
router.use("/categories", categoryRoutes);
router.use("/job-descriptions", jobDescriptionRoutes);
router.use("/applications", applicationRoutes);
router.use("/bookmarks", bookmarkRoutes);

export default router;
