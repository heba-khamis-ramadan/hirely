import { Company } from "../../../db/models/company.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";
import { isValid } from "../../../graphql/validation.js";
import * as companyValidation from "../company.validation.js"

export const getCompanies = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    const companies = await Company.find();
    return {success: true, statusCode: 200, data: companies};
};

export const banCompany = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    isValid(companyValidation.ban_company);
    const { companyId, isBanned } = args;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new Error(messages.company.notFound, {cause: 404}));
    };
    //update company status
    company.isBanned = isBanned;
    await company.save();
    return {success: true, statusCode: 200, data: company};
};

export const approveCompany = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    isValid(companyValidation.approve_company);
    const { companyId } = args;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new Error(messages.company.notFound, {cause: 404}));
    };
    //update company status
    company.approvedByAdmin = true;
    await company.save();
    return {success: true, statusCode: 200, data: company};
};