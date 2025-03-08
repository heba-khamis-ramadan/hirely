import connectDB from "./db/db.connection.js";
import { globalError, notFound } from "./utils/index.js";
import {rateLimit} from "express-rate-limit";
import { createHandler } from "graphql-http/lib/use/express";
// import adminRouter from "./modules/admin/admin.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import { schema } from "./app.schema.js";

const bootstrap = async (app, express) => {
    // cors
    app.use(cors("*"));
    // rate limit
    app.use(rateLimit({
        windowMs: 3 * 60 * 1000,
        limit: 5,
        statusCode: 429,
        message: "too many requests, please try again later 🙁",
        handler: (req, res, next, options) => {
            return next(new Error(options.message, {cause: options.statusCode}));
        },
        legacyHeaders: false
    }));

    // parse req
    app.use(express.json());

    // connect to db
    await connectDB();

    // //=== routers ===//
    //admin
    app.all("/admin", createHandler({schema, 
        context: (req) => {
            const {authorization} = req.headers;
            return {authorization};
        },
        formatError: (error) => {
            return {
                success: false,
                statusCode: error.originalError?.cause || 500,
                message: error.originalError?.message || "server error!!!",
                stack: error.originalError?.stack
            };
        }}));
    //auth
    app.use("/auth", authRouter);
    //users
    app.use("/users", userRouter);
    //companies
    app.use("/companies", companyRouter);

    // handle invalid req
    app.all("*",notFound);

    //=== global error handler ===//
    app.use(globalError);
};

export default bootstrap;