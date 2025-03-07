import { Router } from "express";
import * as companyService from "./company.service.js"
import * as companyValidation from "./company.validation.js"
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { fileValidation } from "../../utils/file upload/multer_cloud.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { cloudUpload } from "../../utils/file upload/multer_cloud.js";

const router = Router();

// add company
router.post("/", isAuthenticated, 
    isValid(companyValidation.add_company), 
    asyncHandler(companyService.add_company));
// update company
router.post("/", isAuthenticated, 
    isValid(companyValidation.update_company),
    asyncHandler(companyService.update_company));
// delete company
router.delete("/", isAuthenticated, asyncHandler(companyService.delete_company));
// get company profile by id
router.get("/:companyId", isAuthenticated, 
    isValid(companyValidation.get_company_jobs), 
    asyncHandler(companyService.get_company_jobs));
// get company profile by name
router.get("/by-name", isAuthenticated, 
    isValid(companyValidation.get_company_profile), 
    asyncHandler(companyService.get_company_profile));
// upload company logo - cloud
router.post("/company-logo", 
    isAuthenticated, 
    cloudUpload(fileValidation.images).single("image"),
    asyncHandler(companyService.upload_company_logo_cloud));
// delete company logo - cloud
router.delete("/company-logo", 
    isAuthenticated, 
    asyncHandler(companyService.delete_company_logo_cloud));
// upload cover pic - cloud
router.post("/cover-pic", 
    isAuthenticated, 
    cloudUpload(fileValidation.images).single("image"),
    asyncHandler(companyService.upload_cover_pic_cloud));
// delete cover pic - cloud
router.delete("/cover-pic", 
    isAuthenticated, 
    asyncHandler(companyService.delete_cover_pic_cloud));

export default router;