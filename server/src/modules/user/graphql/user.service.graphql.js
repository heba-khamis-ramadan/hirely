import { User } from "../../../db/models/user.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";

export const getUsers = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    isValid(,args);
    const users = await User.find();
    return {success: true, statusCode: 200, data: users};
};