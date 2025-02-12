import express from 'express';
import VendorOrganizationController from '../controllers/vendorOrganization.controller';

const router = express.Router();

// GET /api/vendor-organizations - Get all vendor organizations
router.get('/', VendorOrganizationController.getAllVendorOrganizations);

// GET /api/vendor-organizations/:vendorOrgId - Get vendor organization by ID
router.get('/:vendorOrgId', VendorOrganizationController.getVendorOrganizationById);

// POST /api/vendor-organizations - Create a new vendor organization
router.post('/', VendorOrganizationController.createVendorOrganization);

// PUT /api/vendor-organizations/:vendorOrgId - Update a vendor organization
router.put('/:vendorOrgId', VendorOrganizationController.updateVendorOrganization);

// DELETE /api/vendor-organizations/:vendorOrgId - Delete a vendor organization
router.delete('/:vendorOrgId', VendorOrganizationController.deleteVendorOrganization);

export default router;
