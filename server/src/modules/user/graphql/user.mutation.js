import { banUser } from "./user.service.graphql.js";
import { banUserResponse } from "./user.response.js";

export const userMutation = {
    // ban or unban a user
    banUser: {
        type: banUserResponse,
        resolve: banUser
    }
};