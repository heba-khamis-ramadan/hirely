import { getUsers } from "./user.service.graphql.js";
import { getUsersResponse } from "./user.response.js";

export const userQuery = {
    // get users
    getUsers: {
        type: getUsersResponse,
        resolve: getUsers
    }
};