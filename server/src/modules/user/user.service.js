import { User } from "../../db/models/user.model.js";
import { decrypt } from "../../utils/crypto/index.js";
import * as constants from "../../utils/general/constants.js"
import { messages } from "../../utils/messages/index.js";
import cloudinary from "../../utils/file upload/cloud_config.js";

export const update_user = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    const {mobileNumber, 
           DOB ,
           firstName, 
           lastName, 
           gender} = req.body;
    // check user
    const user = await User.findById(userExistance.id);
    if (!user) {
        return next(new Error(messages.user.notFound, {cause: 404}));
    }; 
    // update user password
    user.firstName = firstName;
    user.lastName = lastName;
    user.mobileNumber = mobileNumber;
    user.DOB = DOB;
    user.gender = gender;
    await user.save();
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully}); 
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
    const {password, newPassword} = req.body;
    // check email
    const user = await User.findById(req.authUser.id);
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
    const userExistance = req.authUser;
    //delete old pic
    if(userExistance.profilePic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(userExistance.profilePic.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/users/${userExistance.id}/profile-pic`});
    // update database
    const result = await User.findByIdAndUpdate(userExistance.id, 
        {profilePic: {secure_url, public_id}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_profile_pic_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    //delete profile pic
    if(userExistance.profilePic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(userExistance.profilePic.public_id);
    };
    //update with the default pic
    const result = await User.findByIdAndUpdate(userExistance.id, 
        {profilePic: {secure_url: constants.defaultSecureURL, public_id: constants.defaultPublicId}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const upload_cover_pic_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    //delete old pic
    if(userExistance.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(userExistance.coverPic.public_id);
    };
    // upload to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder: `hirely/users/${userExistance.id}/cover-pic`});
    // update database
    const result = await User.findByIdAndUpdate(userExistance.id, 
        {coverPic: {secure_url, public_id}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_cover_pic_cloud = async (req, res, next) => {
    const userExistance = req.authUser;
    //delete cover pic
    if(userExistance.coverPic.public_id != constants.defaultPublicId) {
        await cloudinary.uploader.destroy(userExistance.coverPic.public_id);
    };
    //update with the default pic
    const result = await User.findByIdAndUpdate(userExistance.id, 
        {coverPic: {secure_url: constants.defaultSecureURL, public_id: constants.defaultPublicId}}, 
        {new: true});
    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const delete_user = async (req, res, next) => {
    // get user data from req
    const userExistance = req.authUser;
    // soft delete the user
    const result = await User.findOneAndUpdate({id: userExistance.id, isDeleted: false}, 
        { $set:{isDeleted: true, deletedAt: Date.now()}});
    // send response
    return res.status(200).json({success: true, message: messages.user.deletedSuccessfully, data: result});
};