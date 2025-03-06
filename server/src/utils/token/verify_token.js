import jwt from "jsonwebtoken";

export const verify = ({token, secretKey = process.env.JWT_KEY}) => {
    try {
        return jwt.verify(token, secretKey); 
    } catch (error) {
        return {error};      
    }
};