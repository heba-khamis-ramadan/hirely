import { Company } from "../../../db/models/company.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";
import { isValid } from "../../../graphql/validation.js";

export const getCompanies = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    isValid(,args)
    const companies = await Company.find();
    return {success: true, statusCode: 200, data: companies};
};