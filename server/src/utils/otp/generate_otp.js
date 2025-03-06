import randomstring from "randomstring";

export const generateOTP = () => {
    return randomstring.generate(7);
};