import { User } from "../../../db/models/user.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";
import { isValid } from "../../../graphql/validation.js";
import * as userValidation from "../user.validation.js"

export const getUsers = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    const users = await User.find();
    return {success: true, statusCode: 200, data: users};
};

export const banUser = async (_, args, context) => {
    await isAuthenticated(context);
    isAuthorized(context, "admin");
    isValid(userValidation.ban_user);
    const { userId, isBanned } = args;
    const user = await User.findById(userId);
    if (!user) {
        return next(new Error(messages.user.notFound, {cause: 404}));
    };
    //update user status
    user.isBanned = isBanned;
    await user.save();
    return {success: true, statusCode: 200, data: user};
};