import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generarJWT = (id, cargo) => {
    return jwt.sign({id, cargo}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

export default generarJWT;