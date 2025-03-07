import { Company } from "../../db/models/company.model.js";
import { messages } from "../../utils/messages/index.js";
import * as constants from "../../utils/general/constants.js"
import cloudinary from "../../utils/file upload/cloud_config.js";

export const update_user = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {
        companyName,
        companyEmail,
        description ,
        industry, 
        address,
        HRs,
        numberOfEmployees,
        legalAttachment} = req.body;
    // check if company already exists
    let company = await Company.find({
        $and: [{ companyEmail }, { companyName }]
      });
    if (company.length > 0) return next(new Error("company already exists", {cause: 400}));
    // upload attachment
    let attachment = {};
    if(req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder: `social-media-app/users/${post.user}/posts/comments`}
        );
        attachment = {secure_url, public_id};
    };
    // create company
    const result = await Post.create({
        createdBy: req.authUser.id,
        companyName,
        companyEmail,
        description ,
        industry, 
        address,
        HRs,
        numberOfEmployees,
        legalAttachment});

    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};