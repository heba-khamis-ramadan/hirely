import { Job } from "../../db/models/job.model.js";
import { Company } from "../../db/models/company.model.js";
import { messages } from "../../utils/messages/index.js";
import * as constants from "../../utils/general/constants.js"

export const add_job = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId,
        closed
    } = req.body;
    // check user
    const company = await Company.findOne({id: companyId});
    if (!company) {
        return next(new Error(messages.company.notFound, {cause: 404}));
    };
    if ( !company.HRs.includes(userExistance.id) || company.createdBy.toString() != userExistance.id.toString()) {
        next(new Error("not authurized", {cause: 401}));
    }; 
    // create company
    const result = await Job.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: userExistance.id,
        companyId,
        closed});

    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

export const update_job = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const jobId = req.params;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        closed
    } = req.body;
    // check user
    const job = await Job.findById( jobId ).populate('companyId');
    if (!job) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };
    if ( job.companyId.createdBy.toString() != userExistance.id) {
        next(new Error("not authurized", {cause: 401}));
    }; 
    // create company
        job.jobTitle = jobTitle;
        jop.jobLocation = jobLocation;
        jop.workingTime = workingTime;
        jop.seniorityLevel = seniorityLevel;
        jop.jobDescription = jobDescription;
        jop.technicalSkills = technicalSkills;
        jop.softSkills = softSkills;
        jop.updatedBy =  userExistance.id;
        jop.closed = closed;

        const result = await job.save();

    // send response
    return res.status(200).json({success: true, message: messages.user.updatedSuccessfully, data: result}); 
};

update_job