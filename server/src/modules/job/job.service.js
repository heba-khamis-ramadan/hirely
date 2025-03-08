import { Job } from "../../db/models/job.model.js";
import { Company } from "../../db/models/company.model.js";
import { Application } from "../../db/models/application.model.js";
import { messages } from "../../utils/messages/index.js";
import cloudinary from "../../utils/file upload/cloud_config.js";

export const add_job = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {companyId} = req.params;
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
    const company = await Company.findOne({id: companyId});
    if (!company) {
        return next(new Error(messages.company.notFound, {cause: 404}));
    };
    if ( !company.HRs.includes(userExistance.id) || company.createdBy.toString() != userExistance.id.toString()) {
        next(new Error("not authurized", {cause: 401}));
    }; 
    // create job
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
    return res.status(200).json({success: true, message: messages.job.createdSuccessfully, data: result}); 
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
    if (job.companyId.createdBy.toString() != userExistance.id.toString()) {
        next(new Error("not authurized", {cause: 401}));
    }; 
    // update job
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
    return res.status(200).json({success: true, message: messages.job.updatedSuccessfully, data: result}); 
};

export const delete_job = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const jobId = req.params;
    // check user
    const job = await Job.findById( jobId ).populate('companyId');
    if (!job) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };
    if ( !job.companyId.HRs.includes(userExistance.id) ) {
        next(new Error("not authurized", {cause: 401}));
    };

    // delete job
    const result = await job.deleteOne();

    // send response
    return res.status(200).json({success: true, message: messages.job.deletedSuccessfully, data: result}); 
};

export const get_job = async (req, res, next) => {
    // get data from req
    const {jobId, companyId} = req.params;
    const {page, size, sort} = req.query;
    if(!size || size < 0) size = 10;
    if(!page || page < 0) page = 1;
    if(!sort) sort = 'createdAt';
    const skip = size * (page - 1);
    let result;
    if (jobId) {
        result = await Job.findOne({ _id: jobId, companyId}).populate('companyId', 'name');
    } else {
        result = await Job.find({companyId})
        .limit(size)
        .skip(skip)
        .sort({ [sort]: -1 })
        .populate('companyId', 'name');
        const totalDocs = result.countDocuments();
        const totalPages = Math.ceil(totalPages / size);
        const currentPage = parseInt(page);
    };
    if (!result) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };
    // send response
    return res.status(200).json({success: true, data: {result, totalDocs, totalPages, currentPage}}); 
};

export const get_job_filter = async (req, res, next) => {
    // get data from req
    const {jobId, companyId} = req.params;
    const { workingTime, 
        jobLocation, 
        seniorityLevel, 
        jobTitle, 
        technicalSkills,
        softSkills,
        page, size, sort} = req.query;
    // Building the filter object dynamically
    const filters = {};
    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search
    if (technicalSkills) filters.technicalSkills = { $in: technicalSkills.split(',') };
    if (softSkills) filters.softSkills = { $in: softSkills.split(',') };
    if(!size || size < 0) size = 10;
    if(!page || page < 0) page = 1;
    if(!sort) sort = 'createdAt';
    const skip = size * (page - 1);
    const result = await Job.find(filters)
    .limit(size)
    .skip(skip)
    .sort({ [sort]: -1 })
    .populate('companyId', 'name');
    const totalDocs = result.countDocuments();
    const totalPages = Math.ceil(totalPages / size);
    const currentPage = parseInt(page);

    if (!result) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };

    // send response
    return res.status(200).json({success: true, data: {result, totalDocs, totalPages, currentPage}}); 
};

export const get_job_applications = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    const {jobId, companyId} = req.params;
    const {page, size, sort} = req.query;
    if(!size || size < 0) size = 10;
    if(!page || page < 0) page = 1;
    if(!sort) sort = 'createdAt';
    const skip = size * (page - 1);
    // find applications
    const result = await Job.find({_id: jobId, companyId})
    .limit(size)
    .skip(skip)
    .sort({ [sort]: -1 })
    .populate({
        path: 'applications',
        populate: { 
            path: 'userId', 
            select: 'firstName lastName email' },
      });
    const totalDocs = result.countDocuments();
    const totalPages = Math.ceil(totalPages / size);
    const currentPage = parseInt(page);
    if ( !result.companyId.HRs.includes(userExistance.id) || result.companyId.createdBy.toString() != userExistance.id.toString()) {
        next(new Error("not authurized", {cause: 401}));
    };
    
    if (!result) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };

    // send response
    return res.status(200).json({success: true, data: {result, totalDocs, totalPages, currentPage}}); 
};

export const apply_job = async (req, res, next) => {
    // get data from req
    const userExistance = req.authUser;
    // check if job already exists
    const jobId = req.params;
    const job = await Job.findById( jobId );
    if (!job) {
        return next(new Error(messages.job.notFound, {cause: 404}));
    };
    // upload cv
    let userCV = {};
    if(req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder: `hirely/applications/${jobId}/cv`}
        );
        userCV = {secure_url, public_id};
    };
    // add application
    const result = await Application.create({
        jobId,
        userId: userExistance.id,
        userCV});

    // send response
    return res.status(200).json({success: true, message: messages.application.createdSuccessfully, data: result}); 
};
