import { banCompany, approveCompany } from "./company.service.graphql.js";
import { banCompanyResponse, approveCompanyResponse } from "./company.response.js";

export const companyMutation = {
    // ban or unban a company
    banCompany: {
        type: banCompanyResponse,
        resolve: banCompany
    },
    // approve a company
    approveCompany: {
        type: approveCompanyResponse,
        resolve: approveCompany
    }
};