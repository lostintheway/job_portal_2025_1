import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { authenticate, authorizeCompany } from "../middleware/auth";

const router = Router();
const companyController = new CompanyController();

router.post(
  "/",
  authenticate,
  authorizeCompany,
  companyController.createCompany
);
router.get(
  "/profile",
  authenticate,
  authorizeCompany,
  companyController.getCompanyProfile
);
router.put(
  "/:id",
  authenticate,
  authorizeCompany,
  companyController.updateCompany
);

export default router;
