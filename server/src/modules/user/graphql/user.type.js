import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";
import { otpType } from "../../../utils/graphql/otp.type.js";

export const userType = new GraphQLObjectType({
    name: "user",
    fields: {
            firstName: {type: GraphQLString},
            lastName: {type: GraphQLString},
            email: {type: GraphQLString},
            password: {type: GraphQLString},
            mobileNumber: {type: GraphQLString},
            provider: {type: GraphQLString},
            role: {type: GraphQLString},
            gender: {type: GraphQLString},
            DOB: {type: GraphQLString},
            isConfirmed:{type: GraphQLBoolean},
            deletedAt: {type: GraphQLString},
            isDeleted: {type: GraphQLBoolean},
            bannedAt: {type: GraphQLString},
            isBanned: {type: GraphQLBoolean},
            updatedBy: {type: GraphQLString},
            changeCredentialTime: {type: GraphQLString},
            OTP: {type: new GraphQLList(otpType)},
            profilePic: {type: attachmentType},
            coverPic: {type: attachmentType}
    }
});
