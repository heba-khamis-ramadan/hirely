import jwt from "jsonwebtoken";

export const generate = ({payload, secretKey = process.env.JWT_KEY, options = {}}) => {
    return jwt.sign(payload, secretKey, options);
};