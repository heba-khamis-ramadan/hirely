import bcrypt from "bcrypt";

export const compare = ({password, hashedPasword}) => {
    return bcrypt.compareSync(password, hashedPasword);
};