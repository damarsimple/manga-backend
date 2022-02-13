import { genSalt, hash, compare } from "bcrypt";

const getSalt = async () => {
    return await genSalt(10)
}

export const create = async (plain: string) => {
    return await hash(plain, await getSalt());
}

export const verify = async (plain: string, hash: string) => {
    return await compare(plain, hash);
}