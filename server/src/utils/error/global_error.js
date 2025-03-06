import fs from "fs";
import path from "path";

export const globalError = (error, req, res, next) => {
    // req with a file upload rollback handling
    if(req.file) {
        //delete file
        const fullPath = path.resolve(req.file.path);
        fs.unlinkSync(fullPath);
    }
    return res.status(error.cause || 500).json({
        success: false, 
        message:error.message, 
        stack: error.stack});
}