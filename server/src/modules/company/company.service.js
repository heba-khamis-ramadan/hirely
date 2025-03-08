import { Company } from "../../db/models/company.model.js";
import { messages } from "../../utils/messages/index.js";
import * as constants from "../../utils/general/constants.js"
import cloudinary from "../../utils/file upload/cloud_config.js";

export const add_company = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {
        companyName,
        companyEmail,
        description ,
        industry, 
        address,
        HRs,
        numberOfEmployees} = req.body;
    // check if company already exists
    let company = await Company.find({
        $and: [{ companyEmail }, { companyName }]
      });
    if (company.length > 0) return next(new Error("company already exists", {cause: 400}));
    // upload legal attachment
    let legalAttachment = {};
    if(req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder: `hirely/companies/${userExistance.id}/${companyName}/attachments`}
        );
        legalAttachment = {secure_url, public_id};
    };
    // create company
    const result = await Company.create({
        createdBy: userExistance.id,
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

export const update_company = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    const { companyName,
            companyEmail,
            description ,
            industry, 
            address,
            HRs,
            numberOfEmployees} = req.body;
    // check company
    const company = await Company.findOne({createdBy: userExistance.id});
    if (!company) {
        return next(new Error(messages.company.notFound, {cause: 404}));
    }; 
    // update user password
    company.companyName = companyName;
    company.companyEmail = companyEmail;
    company.description = description;
    company.industry = industry;
    company.address = address;
    company.HRs = HRs;
    company.numberOfEmployees = numberOfEmployees;
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, message: messages.company.updatedSuccessfully, data: result}); 
};

export const delete_company = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {companyId} = req.params
    const company = await Company.findById(companyId);
    if(userExistance.role != constants.roles.ADMIN || company.createdBy.toString() != userExistance.id.toString()) {
        return next(new Error("not authurized", {cause: 401}));  
    };
    // soft delete the company
    company.isDeleted = true;
    company.deletedAt = Date.now();
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, 
        message: messages.company.deletedSuccessfully, data: result});
};

export const get_company_jobs = async (req, res, next) => {
    // get data from req
    const {companyId} = req.params
    const result = await Company.findOne({_id: companyId, isDeleted: false}).populate([
        {path: "jobs"}
    ]);
    // send response
    return res.status(200).json({success: true, data: result});
};

export const get_company_profile = async (req, res, next) => {
    // get company data from req
    const companyName = req.query.companyName;
    const result = await User.findOne({ companyName });
    if(!result) return res.status(404).json({success: false, 
        message: messages.company.notFound});
    // send response
    return res.status(200).json({success: true, data: result});
};

export const upload_cover_pic_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    const company = await Company.findOne({createdBy: userExistance.id, isDeleted: false});
    //delete old pic
    if(company.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/companies/${userExistance.id}/${company.companyName}/cover-pic`});
    // update database
    company.coverPic = {secure_url, public_id};
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, message: messages.company.updatedSuccessfully, data: result}); 
};

export const delete_cover_pic_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    const company = await Company.findOne({createdBy: userExistance.id, isDeleted: false});
    //delete cover pic
    if(company.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
    };
    //update with the default pic
    company.coverPic = {secure_url: constants.defaultSecureURL, 
        public_id: constants.defaultPublicId};
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, message: messages.company.updatedSuccessfully, data: result}); 
};

export const upload_logo_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    const company = await Company.findOne({createdBy: userExistance.id, isDeleted: false});
    //delete old pic
    if(company.logo.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(company.logo.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/companies/${userExistance.id}/${company.companyName}/logo`});
    // update database
    company.logo = {secure_url, public_id};
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, message: messages.company.updatedSuccessfully, data: result}); 
};

export const delete_logo_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    const company = await Company.findOne({createdBy: userExistance.id, isDeleted: false});
    //delete logo
    if(company.logo.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(company.logo.public_id);
    };
    //update with the default pic
    company.logo = {secure_url: constants.defaultSecureURL, 
        public_id: constants.defaultPublicId};
    const result = await company.save();
    // send response
    return res.status(200).json({success: true, message: messages.company.updatedSuccessfully, data: result}); 
};