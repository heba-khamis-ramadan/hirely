import { Schema, Types, model } from "mongoose";
import * as constants from "../../utils/general/constants.js"

// schema
const applicationSchema = new Schema({
    jobId: {type: Types.ObjectId, ref: "Job", required: true},
    userId: {type: Types.ObjectId, ref: "User", required: true},
    userCV: { type : {secure_url: {type: String, required: true},
              public_id: {type: String, required: true}}, 
              required: true
            },
    status: {type: String, 
        required: true, 
        enum: Object.values(constants.status), 
        default: constants.status.PENDING},
}, {
    timestamps: true
});

// model
export const Application = model("Application", applicationSchema);