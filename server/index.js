import express from "express";
import bootstrap from "./src/app.controller.js";
import "./src/utils/cron/cleanupOTPs.js"

const app = express();
const port = 3000;

bootstrap(app, express);

app.listen(port, () => {
    console.log("server is runing on port:", port);
});