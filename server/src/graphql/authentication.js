import { User } from "../db/models/user.model.js";
import { messages, verify } from "../utils/index.js";

export const isAuthenticated = async (context) => {
    const {authorization} = context;
    if (!authorization) {
        throw new Error("token is required :(", {cause: 400});
    }
    if (!authorization.startsWith("access")) {
        throw new Error("invalid bearer key :(", {cause: 400});
    }
    const token = authorization.split(" ")[1];
    const {email, id, iat, error} = verify({token});
    if (error) {
        throw new Error(error);
    }
    // check user
    const userExistance = await User.findById(id);
    if (!userExistance) {
        throw new Error(messages.user.notFound, {cause: 400});
    };
    if(userExistance.isDeleted == true) {
        throw new Error("please log in first!!", {cause: 400});
    };
    if(userExistance.deletedAt?.getTime() > iat * 1000 ) {
        throw new Error("destroyed token!!", {cause: 400});
    };
    // user data pass to req
    context.authUser = userExistance;
};