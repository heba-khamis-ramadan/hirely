import { GraphQLObjectType, GraphQLString } from "graphql";

export const otpType = new GraphQLObjectType({
    name: "otp",
    fields: {
        code: {type: GraphQLString},
        codeType: {type: GraphQLString},
        expiresIn: {type: GraphQLString}
    }
});