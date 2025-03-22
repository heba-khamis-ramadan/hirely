import joi from "joi";
import { genders } from "../../utils/general/constants.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const update_user = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    mobileNumber: joi.string().required(),
    DOB: joi.date().required(),
    gender: joi.string().valid(...Object.values(genders))
}).required();

export const update_password = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    newPassword: joi.string().required()
}).required();

export const get_user_profile = joi.object({
    email: joi.string().email().required()
}).required();

export const ban_user = joi.object({
    userId: joi.custom(isValidId).required(),
    isBanned: joi.boolean()
}).required();