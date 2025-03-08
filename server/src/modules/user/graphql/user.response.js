import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { userType } from "./user.type";

export const getUsersResponse = new GraphQLObjectType({
    name: "getUsersResponse",
    fields: {
        success: {type: GraphQLBoolean},
        statusCode: {type: GraphQLInt},
        data: {type: new GraphQLList(userType)}
    }
});