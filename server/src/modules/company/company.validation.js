import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const add_company = joi.object({
    companyName: joi.string().min(2).max(50).required(),
    companyEmail: joi.string().email().required(),
    description: joi.string().required(),
    industry: joi.string(),
    address: joi.string(),
    HRs: joi.array().items(joi.custom(isValidId)).min(1).required(),
    numberOfEmployees: joi.array().items(joi.number()).min(1).required(),
    legalAttachment: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required()
}))}).required();

export const update_company = joi.object({
    companyName: joi.string().min(2).max(50),
    companyEmail: joi.string().email(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    HRs: joi.array().items(joi.custom(isValidId)).min(1),
    numberOfEmployees: joi.array().items(joi.number()).min(1)
}).required();

export const delete_company = joi.object({
    companyId: joi.custom(isValidId).required()
}).required();

export const get_company_jobs = joi.object({
    id: joi.custom(isValidId).required()
}).required();

export const get_company_profile = joi.object({
    companyName: joi.string()
}).required();