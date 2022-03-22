import { SECRET_KEY } from './Key';
import { sign, verify } from "jsonwebtoken"

export const createToken = <T>(e: T) => {


    return sign(e as unknown as object, SECRET_KEY, { expiresIn: '1d' });


}

export const parseToken = <T>(e: string): T | undefined => {


    try {
        return verify(e, SECRET_KEY) as T;
    } catch (error) {
        return
    }


}