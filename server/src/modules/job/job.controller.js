import { Router } from "express";
import * as jobService from "./job.service.js"
import * as jobValidation from "./job.validation.js"
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { roles } from "../../utils/general/constants.js"

const router = Router({mergeParams: true});

// add job
router.post("/", isAuthenticated, 
    isValid(jobValidation.add_job), 
    asyncHandler(jobService.add_job));
// update job
router.put("/:jobId", isAuthenticated, 
    isValid(jobValidation.update_job),
    asyncHandler(jobService.update_job));
// delete job
router.delete("/:jobId", 
    isAuthenticated,
    isValid(jobValidation.delete_job),  
    asyncHandler(jobService.delete_job));
// get application for a job by jobId
router.get("/applications/:jobId", isAuthenticated,
    isValid(jobValidation.get_job_applications), 
    asyncHandler(jobService.get_job_applications));
// get jobs by id
router.get("/:jobId?", isAuthenticated, 
    isValid(jobValidation.get_job), 
    asyncHandler(jobService.get_job));
// get jobs by filter
router.get("/", isAuthenticated, 
    isValid(jobValidation.get_job_filter), 
    asyncHandler(jobService.get_job_filter));
// apply to a job
router.post("/apply/:jobId", isAuthenticated,
    isAuthorized(roles.USER),
    isValid(jobValidation.apply_job),
    asyncHandler(jobService.apply_job));

export default router;