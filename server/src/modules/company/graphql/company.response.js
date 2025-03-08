import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { companyType } from "./company.type";

export const getCompaniesResponse = new GraphQLObjectType({
    name: "getCompaniesResponse",
    fields: {
        success: {type: GraphQLBoolean},
        statusCode: {type: GraphQLInt},
        data: {type: new GraphQLList(companyType)}
    }
});