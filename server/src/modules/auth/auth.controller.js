import { Router } from "express";
import * as authService from "./auth.service.js"
import * as authValidation from "./auth.validation.js"
import { asyncHandler } from "../../utils/index.js";
import { isValid } from "../../middlewares/validation.middleware.js";

const router = Router();

// signup
router.post("/signup", isValid(authValidation.signup), asyncHandler(authService.signup));
// confirm
router.post("/confirm", isValid(authValidation.confirm), asyncHandler(authService.confirm));
// login
router.post("/login", isValid(authValidation.login), asyncHandler(authService.login));
// signup with google
router.post("/google-signup", isValid(authValidation.googleSignup), asyncHandler(authService.googleSignup));
// login with google
router.post("/google-login", isValid(authValidation.googleLogin), asyncHandler(authService.googleLogin));
// forget password
router.post("/forget-password", isValid(authValidation.forgetPassword), asyncHandler(authService.forgetPassword));
// reset password
router.post("/reset-password", isValid(authValidation.reset), asyncHandler(authService.reset));

export default router;