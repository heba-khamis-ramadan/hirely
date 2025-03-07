import { Schema, Types, model } from "mongoose";

// schema
const companySchema = new Schema({
    companyName: {type: String, required: true, maxlength: 50, trim: true, unique: [true, "company already exist"]},
    description: {type: String, required: true},
    industry: {type: String},
    address: {type: String},
    numberOfEmployees: { type: [Number],
        validate: [
            { validator: function (value) {
              return value.length === 2;
            },message: 'number of employees must be a range of two numbers: [min, max].'
        },
          { validator: function (value) {
            return value[0] < value[1];
            }, message: 'The first value (min) must be less than the second value (max).'
        }
        ]
      },
    companyEmail: {type: String, required: true, unique: [true, "email already exist"], lowercase: true},
    createdBy: {type: Types.ObjectId, ref: "User", required: true},
    logo: { type: {secure_url: {type: String, default: constants.defaultSecureURL}, 
                   public_id: {type: String, default: constants.defaultPublicId}}
                },
    coverPic: { type: {secure_url: {type: String, default: constants.defaultSecureURL}, 
                       public_id: {type: String, default: constants.defaultPublicId}}
                },
    HRs: {type: [Types.ObjectId], ref: "User", required: true, minlength: 1},
    legalAttachment: { type: {secure_url: {type: String, required: true}, 
                       public_id: {type: String, required: true}},
                       required: true
                },
    approvedByAdmin: {type: Boolean, default: false},
    deletedAt: {type: Date},
    isDeleted: {type: Boolean, default: false},
    bannedAt: {type: Date},
    isBanned: {type: Boolean, default: false},
    updatedBy: {type: Types.ObjectId, ref: "User"},
}, {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId"
});

// model
export const Company = model("Company", companySchema);