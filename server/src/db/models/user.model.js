import { Schema, Types, model } from "mongoose";
import * as constants from "../../utils/general/constants.js"

// schema
const userSchema = new Schema({
    firstName: {type: String, required: true, maxlength: 50, trim: true},
    lastName: {type: String, required: function () {
        return this.provider == constants.providers.SYSTEM ? true : false;
    }, maxlength: 50, trim: true},
    email: {type: String, required: true, unique: [true, "email already exist"], lowercase: true},
    password: {type: String, required: function () {
        return this.provider == constants.providers.SYSTEM ? true : false;
    }},
    mobileNumber: {type: String, required: function () {
        return this.provider == constants.providers.SYSTEM ? true : false;
    }, unique: true},
    provider: {type: String, enum: Object.values(constants.providers), default: constants.providers.SYSTEM},
    role: {type: String, enum: Object.values(constants.roles), default: constants.roles.USER},
    gender: {type: String, enum: Object.values(constants.genders), default: constants.genders.USER},
    DOB: {type: Date, required: function () {
        return this.provider == constants.providers.SYSTEM ? true : false;
    }, validate: [
        { validator: function (value) {
            // ensures DOB is before current date
            const today = new Date();
            return value < today;
        }, message: 'date of birth must be before the current date.'
    },
       { validator: function (value) {
            // ensures age is above 18 years
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            return value <= minDate;
        }, message: 'user must be at least 18 years old.'
    },
        { validator: function (value) {
            // Ensure DOB is in YYYY-MM-DD format
            const dateString = value.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format regex
            return dateFormat.test(dateString);
        }, message: 'date of birth must be in the format YYYY-MM-DD (e.g., 2023-12-04).'
      }

    ]},
    isConfirmed: {type: Boolean, default: false},
    deletedAt: {type: Date},
    isDeleted: {type: Boolean, default: false},
    bannedAt: {type: Date},
    isBanned: {type: Boolean, default: false},
    updatedBy: {type: Types.ObjectId, ref: "User"},
    changeCredentialTime: {type: Date},
    OTP: { type: [{code: {type: String},
                   codeType: {type: String, enum: Object.values(constants.otpTypes)},
                   expiresIn: {type: Date}}]
         },
    profilePic: { type: {secure_url: {type: String, default: constants.defaultSecureURL}, 
                  public_id: {type: String, default: constants.defaultPublicId}}
                }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

// virtuals
userSchema.virtual("username").get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

// model
export const User = model("User", userSchema);