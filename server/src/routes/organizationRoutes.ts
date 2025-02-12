import { Router } from "express";
import { OrganizationController } from "../controllers/OrganizationController";
import { authenticate, authorizeOrganization } from "../middleware/auth";

const router = Router();
const organizationController = new OrganizationController();

router.post(
  "/organization/",
  authenticate,
  authorizeOrganization,
  organizationController.createOrganization
);
router.get(
  "/organization/profile",
  authenticate,
  authorizeOrganization,
  organizationController.getOrganizationProfile
);
router.put(
  "/organization/:id",
  authenticate,
  authorizeOrganization,
  organizationController.updateOrganization
);

export default router;
