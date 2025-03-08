import { Schema, Types, model } from "mongoose";
import * as constants from "../../utils/general/constants.js"

// schema
const jobSchema = new Schema({
    jobTitle: {type: String, required: true, maxlength: 20, trim: true},
    jobLocation: {type: String, required: true, enum: Object.values(constants.location)},
    workingTime: {type: String, required: true, enum: Object.values(constants.time)},
    seniorityLevel: {type: String, required: true, enum: Object.values(constants.seniority)},
    jobDescription: {type: String, required: true},
    technicalSkills: {type: [String], required: true, minlength: 1},
    softSkills: {type: [String], required: true, minlength: 1},
    addedBy: {type: Types.ObjectId, ref: "User", required: true},
    updatedBy: {type: Types.ObjectId, ref: "User"},
    companyId: {type: Types.ObjectId, ref: "Company", required: true},
    closed: {type: Boolean, default: false},
}, {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

companySchema.virtual("applications", {
    ref: "Application",
    localField: "_id",
    foreignField: "jopId"
  });

// model
export const Job = model("Job", jobSchema);