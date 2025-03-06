import { Types } from "mongoose";

// Middleware to validate requests
export const isValid = (schema) => {
    return (req, res, next) => {
      const data = {...req.body, ...req.params, ...req.query};
      if(req.file || req.files) data.attachment = req.file || req.files;
      const result = schema.validate(data, {abortEarly: false});
      if (result.error) {
          let messages = result.error.details.map((obj) =>  obj.message);
          return next(new Error(messages, {cause:400}));
      }
      return next();
    };
};

// Middleware to validate Ids
export const isValidId = (value, helpers) => {
  if(!Types.ObjectId.isValid(value)) {
    return helpers.message("invalid Id!!!");
  }
  return true;
};