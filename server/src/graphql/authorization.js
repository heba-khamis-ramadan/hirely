export const isAuthorized = (context, ...roles) => {
    if(!roles.includes(context.authUser.role)) {
        throw new Error("not authorized!!", {cause: 401});
    }
};