import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "./modules/user/graphql/user.query.js";
import { companyQuery } from "./modules/company/graphql/company.query.js";

const query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // get users
        ...userQuery,
        // get companies
        ...companyQuery
    },
});

export const schema = new GraphQLSchema({
    query,
    mutation
});