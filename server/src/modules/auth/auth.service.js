import { User } from "../../db/models/user.model.js";
import { sendEmail } from "../../utils/email/send_email.js";
import { compare, hash, generate, messages  } from "../../utils/index.js";
import { generateOTP } from "../../utils/otp/generate.js";
import * as constants from "../../utils/general/constants.js";
import {OAuth2Client} from "google-auth-library";

export const signup = async (req, res, next) => {
    const {firstName, lastName, email, password, mobileNumber, gender, role, DOB} = req.body;
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) return next(new Error("User already exists", {cause: 400}));
    // generate otp
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;  // 10 mins expiry
    // create user
    const createdUser = await User.create({
        firstName,
        lastName,
        email, 
        password,
        OTP: [{code:hash({otp}), codeType: constants.otpTypes.confirmEmail, expiresIn: otpExpiry}],
        mobileNumber,
        role,
        gender,
        DOB
    });
    // send email
    const isSent = await sendEmail({to: email, 
        subject: "confirm email", 
        html: `<h4> your OTP is: ${otp} , only valid for 10 mins</h4>`});
    if(!isSent) return next(new Error("email not sent please try again :(", {cause: 500}));
    // send response
   return res.status(201).json({success: true, message: messages.user.createdSuccessfully}); 
};

export const confirm = async (req, res, next) => {
    const { email, OTP } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) return next(new Error(messages.user.notFound, {cause: 400}));
    // check OTP
    const otpMatch = compare({OTP, hashedOTP: user.OTP.code});
    // check OTP and Expiry
    if (user.OTP.codeType !== constants.otpTypes.confirmEmail || !otpMatch || user.OTP.expiresIn < Date.now()) {
        return next(new Error("Invalid or expired OTP", {cause: 400}));
    }
    // update user as confirmed
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({ message: "account confirmed successfully!" });   
};

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    // check email
    const user = await User.findOne({email});
    if (!user) {
        return next(new Error(messages.email.notFound, {cause: 404}));
    };
    // check confirmation
    if (!user.isConfirmed) {
        return next(new Error("please confirm your account first!", {cause: 404}));
    }; 
    // check password
    if (!password == user.password) {
        return next(new Error(messages.user.invalidPassword, {cause: 404}));
    };
    // change isDeleted back to false
    const id = user.id;
    if(user.isDeleted == true) {
        await User.findByIdAndUpdate(id, {isDeleted: false});
    };
    // generate token
    const token = generate({payload: {email, id: user.id}, options: {expiresIn: "1h"}});
    const refreshToken = generate({payload: {email, id: user.id}, options: {expiresIn: "7d"}});
    // send response
   return res.status(200).json({success: true, message: messages.user.loggedIn, token, refreshToken});
};

const verifyGoogleToken = async (idToken) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.client_id,
    });
    const payload = ticket.getPayload();
    return payload;
};

export const googleSignup = async (req, res, next) => {
    // get data from request
    const {idToken} = req.body;
    // check token
    const {email, name, picture} = verifyGoogleToken(idToken);
    // check email
    const user = await User.findOne({email});
    if (user) return next(new Error("User already exists", {cause: 400}));
    // generate otp
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;  // 10 mins expiry
    const createdUser = await User.create({firstName: name, 
        email, 
        profilePic: picture,
        OTP: [{code:hash({otp}), codeType: constants.otpTypes.forgetPassword, expiresIn: otpExpiry}],
        provider: constants.providers.GOOGLE});
    // send email
    const isSent = await sendEmail({to: email, 
        subject: "confirm email", 
        html: `<h4> your OTP is: ${otp} , only valid for 10 mins</h4>`});
        if(!isSent) return next(new Error("email not sent please try again :(", {cause: 500}));
    // send response
    return res.status(201).json({success: true, message: messages.user.createdSuccessfully, data: createdUser}); 
};

export const googleLogin = async (req, res, next) => {
    // get data from request
    const {idToken} = req.body;
    // check token
    const {email} = verifyGoogleToken(idToken);
    // check email
    const user = await User.findOne({email});
    if (!user) {
        return next(new Error(messages.email.notFound, {cause: 404}));
    };
    // check confirmation
    if (!user.isConfirmed) {
        return next(new Error("please confirm your account first!", {cause: 404}));
    }; 
    // change isDeleted back to false
    const id = user.id;
    if(user.isDeleted == true) {
        await User.findByIdAndUpdate(id, {isDeleted: false});
    };
    // generate token
    const token = generate({payload: {email, id: user.id}, options: {expiresIn: "1h"}});
    const refreshToken = generate({payload: {email, id: user.id}, options: {expiresIn: "7d"}});
    // send response
   return res.status(200).json({success: true, message: messages.user.loggedIn, token, refreshToken});
};

export const forgetPassword = async (req, res, next) => {
    const {email} = req.body;
    // check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
        return next(new Error(messages.email.notFound, {cause: 404}));
    };
    // generate otp
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;  // 10 mins expiry
    // update user
    const updateUser = await User.updateOne(
        {email},
        { $push: { OTP: {code:hash({otp}), 
        codeType: constants.otpTypes.forgetPassword, 
        expiresIn: otpExpiry}} });
    // send email
    const isSent = await sendEmail({to: email, 
        subject: "reset password", 
        html: `<h4> your OTP is: ${otp} , only valid for 10 mins</h4>`});
    if(!isSent) return next(new Error("email not sent please try again :(", {cause: 500}));
    // send response
   return res.status(201).json({success: true});
};

export const reset = async (req, res, next) => {
    const { email, OTP, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) return next(new Error(messages.user.notFound, {cause: 400}));
    // check OTP
    const otpMatch = compare({OTP, hashedOTP: user.OTP.code});
    // check OTP and Expiry
    if (user.OTP.codeType !== constants.otpTypes.forgetPassword || !otpMatch || user.OTP.expiresIn < Date.now()) {
        return next(new Error("Invalid or expired OTP", {cause: 400}));
    }
    // update user password
    user.password = password;
    await user.save();
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully});    
};
