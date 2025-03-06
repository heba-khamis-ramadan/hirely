import connectDB from "./db/db.connection.js";
import { globalError, notFound } from "./utils/index.js";
import {rateLimit} from "express-rate-limit";
// import adminRouter from "./modules/admin/admin.controller.js";
// import authRouter from "./modules/auth/auth.controller.js";
// import userRouter from "./modules/user/user.controller.js";
// import postRouter from "./modules/post/post.controller.js";
// import commentRouter from "./modules/comment/comment.controller.js";

const bootstrap = async (app, express) => {
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
    // //admin
    // app.use("/admin", adminRouter);
    // //auth
    // app.use("/auth", authRouter);
    // //users
    // app.use("/users", userRouter);
    // //posts
    // app.use("/posts", postRouter);
    // //comments
    // app.use("/comments", commentRouter);

    // handle invalid req
    app.all("*",notFound);

    //=== global error handler ===//
    app.use(globalError);
};

export default bootstrap;