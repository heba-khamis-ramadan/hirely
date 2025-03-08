import { User } from "../db/models/user.model.js";
import { messages, verify } from "../utils/index.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            return next(new Error("token is required :(", {cause: 400}));
        }
        if (!authorization.startsWith("access")) {
            return next(new Error("invalid bearer key :(", {cause: 400}));
        }
        const token = authorization.split(" ")[1];
        const {email, id, iat, error} = verify({token});
        if (error) {
            return next(error);
        }
        // check user
        const userExistance = await User.findById(id);
        if (!userExistance) {
            return next(new Error(messages.user.notFound, {cause: 400}));
        };
        if(userExistance.isDeleted == true) {
            return next(new Error("please log in first!!", {cause: 400}));
        };
        if(userExistance.deletedAt?.getTime() > iat * 1000 ) {
            return next(new Error("destroyed token!!", {cause: 400}));
        };
        // user data pass to req
        req.authUser = userExistance;
        return next();
    } catch (error) {
       return next(error);
    }
};