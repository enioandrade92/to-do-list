import * as bcrypt from 'bcrypt';
import { EncodePasswordReturn } from '../@types/encode-password-return.type';

export default class BcryptUtil {
    static async encodePassword(
        password: string,
    ): Promise<EncodePasswordReturn> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return { salt, hashedPassword };
    }

    static comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
