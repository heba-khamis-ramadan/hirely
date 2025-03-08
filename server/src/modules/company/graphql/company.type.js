import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";
import { userType } from "../../user/graphql/user.type.js";
import { User } from "../../../db/models/user.model.js";

export const companyType = new GraphQLObjectType({
    name: "company",
    fields: {
            companyName: {type: GraphQLString},
            description: {type: GraphQLString},
            industry: {type: GraphQLString},
            address: {type: GraphQLString},
            numberOfEmployees: {type: new GraphQLList(GraphQLInt)},
            companyEmail: {type: GraphQLString},
            createdBy: {type: new GraphQLList(userType), resolve: async (parent) => {
                const user = await User.findById(parent.createdBy);
                return user;
            }},
            logo:{type: attachmentType},
            coverPic: {type: attachmentType},
            HRs: {type: new GraphQLList(userType), resolve: async (parent) => {
                const users = await User.find({_id:{$in: parent.HRs}});
                return users;
            }},
            legalAttachment: {type: attachmentType},
            approvedByAdmin: {type: GraphQLBoolean},
            deletedAt: {type: GraphQLString},
            isDeleted: {type: GraphQLBoolean},
            bannedAt: {type: GraphQLString},
            isBanned: {type: GraphQLBoolean},
            updatedBy: {type: new GraphQLList(userType), resolve: async (parent) => {
                const user = await User.findById(parent.updatedBy);
                return user;
            }}
    }
});