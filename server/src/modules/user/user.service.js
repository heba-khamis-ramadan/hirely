import { User } from "../../db/models/user.model.js";
import { decrypt, encrypt } from "../../utils/crypto/index.js";
import * as constants from "../../utils/general/constants.js"
import { messages } from "../../utils/messages/index.js";
import cloudinary from "../../utils/file upload/cloud_config.js";

export const update_user = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    const {mobileNumber, DOB ,firstName, lastName, gender} = req.body;
    const result = await User.findByIdAndUpdate(userExistance.id, {mobileNumber: encrypt({data: mobileNumber}), 
    DOB ,
    firstName, 
    lastName, 
    gender}, {new: true});
    if(!result) return next(new Error(messages.user.notFound));
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const get_user = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    // decrypt phone num
    userExistance.phone = decrypt({data: userExistance.phone});
    // send response
    return res.status(200).json({success: true, data: userExistance});
};

export const get_user_profile = async (req, res, next) => {
    // get user data from req
    const email = req.query.email;
    const result = await User.findOne({ email }).select("-_id userName mobileNumber profilePic coverPic");
    if(!result) return res.status(404).json({success: false, message: messages.user.notFound});
    // send response
    return res.status(200).json({success: true, data: result});
};

export const update_password = async (req, res, next) => {
    // get user data from req
    const {email, password, newPassword} = req.body;
    // check email
    const user = await User.findOne({email});
    if (!user) {
        return next(new Error(messages.email.notFound, {cause: 404}));
    }; 
    // check password
    if (!password == user.password) {
        return next(new Error(messages.user.invalidPassword, {cause: 404}));
    }
    // update user password
    user.password = newPassword;
    await user.save();
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully}); 
};

export const upload_profile_pic_cloud = async (req, res, next) => {
    //delete old pic
    if(req.authUser.profilePic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(req.authUser.profilePic.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/users/${req.authUser.id}/profile-pic`});
    // update database
    const result = await User.findByIdAndUpdate(req.authUser.id, 
        {profilePic: {secure_url, public_id}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_profile_pic_cloud = async (req, res, next) => {
    //delete profile pic
    if(req.authUser.profilePic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(req.authUser.profilePic.public_id);
    };
    //update with the default pic
    const result = await User.findByIdAndUpdate(req.authUser.id, 
        {profilePic: {secure_url: constants.defaultSecureURL, public_id: constants.defaultPublicId}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully}); 
};

export const upload_cover_pic_cloud = async (req, res, next) => {
    //delete old pic
    if(req.authUser.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(req.authUser.coverPic.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/users/${req.authUser.id}/cover-pic`});
    // update database
    const result = await User.findByIdAndUpdate(req.authUser.id, 
        {coverPic: {secure_url, public_id}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_cover_pic_cloud = async (req, res, next) => {
    //delete cover pic
    if(req.authUser.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(req.authUser.coverPic.public_id);
    };
    //update with the default pic
    const result = await User.findByIdAndUpdate(req.authUser.id, 
        {coverPic: {secure_url: constants.defaultSecureURL, public_id: constants.defaultPublicId}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_user = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    const result = await User.updateOne({id: userExistance.id, isDeleted: false}, {isDeleted: true, deletedAt: Date.now()});
    // send response
    return res.status(200).json({success: true, message: messages.user.deletedSuccessfully});
};