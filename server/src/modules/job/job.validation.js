import joi from "joi";
import { location, seniority, time } from "../../utils/general/constants.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const add_job = joi.object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid(...Object.values(location)).required(),
    workingTime: joi.string().valid(...Object.values(time)).required(),
    seniorityLevel: joi.string().valid(...Object.values(seniority)).required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).min(1).required(),
    softSkills: joi.array().items(joi.string()).min(1).required(),
    closed: joi.boolean()
}).required();

export const update_job = joi.object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid(...Object.values(location)).required(),
    workingTime: joi.string().valid(...Object.values(time)).required(),
    seniorityLevel: joi.string().valid(...Object.values(seniority)).required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).min(1).required(),
    softSkills: joi.array().items(joi.string()).min(1).required(),
    closed: joi.boolean(),
    jobId: joi.custom(isValidId)
}).required();

export const delete_job = joi.object({
    jobId: joi.custom(isValidId)
}).required();

export const get_job = joi.object({
    jobId: joi.custom(isValidId),
    companyId: joi.custom(isValidId),
    page: joi.number(),
    size: joi.number(),
    sort: joi.string()
}).required();

export const get_job_filter = joi.object({
    jobLocation: joi.string().valid(...Object.values(location)),
    workingTime: joi.string().valid(...Object.values(time)),
    seniorityLevel: joi.string().valid(...Object.values(seniority)),
    technicalSkills: joi.string(),
    softSkills: joi.string(),
    page: joi.number(),
    size: joi.number(),
    sort: joi.string()
}).required();

export const get_job_applications = joi.object({
    jobId: joi.custom(isValidId),
    companyId: joi.custom(isValidId),
    page: joi.number(),
    size: joi.number(),
    sort: joi.string()
}).required();

export const apply_job = joi.object({
    jobId: joi.custom(isValidId)
}).required();