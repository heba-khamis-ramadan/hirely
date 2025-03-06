export const notFound =  (req, res, next) => {
    return next(new Error("page not found :(", {cause: 404}));
};