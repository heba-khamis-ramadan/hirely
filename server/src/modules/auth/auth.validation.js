import joi from "joi";
import { genders, roles } from "../../utils/general/constants.js";

export const signup = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    mobileNumber: joi.string().required(),
    DOB: joi.date().required(),
    isConfirmed: joi.boolean(),
    isDeleted: joi.boolean(),
    gender: joi.string().valid(...Object.values(genders)),
    role: joi.string().valid(...Object.values(roles))
}).required();

export const confirm = joi.object({
    email: joi.string().email().required(),
    OTP: joi.string().required().length(7)
}).required();

export const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}).required();

export const googleSignup = joi.object({
    idToken: joi.string().required()
}).required();

export const googleLogin = joi.object({
    idToken: joi.string().required()
}).required();

export const forgetPassword = joi.object({
    email: joi.string().email().required()
}).required();

export const reset = joi.object({
    email: joi.string().email().required(),
    OTP: joi.string().required().length(7),
    password: joi.string().required()
}).required();