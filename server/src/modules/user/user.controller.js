import { Router } from "express";
import * as userService from "./user.service.js"
import * as userValidation from "./user.validation.js"
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { fileValidation } from "../../utils/file upload/multer_cloud.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { cloudUpload } from "../../utils/file upload/multer_cloud.js";

const router = Router();

// update user
router.post("/", isAuthenticated, 
    isValid(userValidation.update_user), 
    asyncHandler(userService.update_user));
// get loggedin user data
router.get("/", isAuthenticated, asyncHandler(userService.get_user));
// get user profile by email
router.get("/by-email", isAuthenticated, 
    isValid(userValidation.get_user_profile), 
    asyncHandler(userService.get_user_profile));
// update user password
router.patch("/update_password", isAuthenticated, 
    isValid(userValidation.update_password), 
    asyncHandler(userService.update_password));
// upload profile pic - cloud
router.post("/profile-pic", 
    isAuthenticated, 
    cloudUpload(fileValidation.images).single("image"),
    asyncHandler(userService.upload_profile_pic_cloud));
// delete profile pic - cloud
router.delete("/profile-pic", 
    isAuthenticated, 
    asyncHandler(userService.delete_profile_pic_cloud));
// upload cover pic - cloud
router.post("/cover-pic", 
    isAuthenticated, 
    cloudUpload(fileValidation.images).single("image"),
    asyncHandler(userService.upload_cover_pic_cloud));
// delete cover pic - cloud
router.delete("/cover-pic", 
    isAuthenticated, 
    asyncHandler(userService.delete_cover_pic_cloud));
// delete user
router.delete("/", isAuthenticated, asyncHandler(userService.delete_user));

export default router;