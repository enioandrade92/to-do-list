import {
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../@types/jwt-payload.type';

const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
});

export default class JwtUtil {
    static getAccessToken(payload: JwtPayload) {
        return jwtService.sign(payload, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    static getRefreshToken(payload: JwtPayload) {
        return jwtService.sign(payload, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });
    }

    static verifyToken(token: string) {
        try {
            return jwtService.verify(token);
        } catch (err) {
            throw err?.message === 'jwt expired'
                ? new UnauthorizedException('Token expired')
                : new InternalServerErrorException(err?.message);
        }
    }

    static decodeToken(token: string) {
        return jwtService.decode(token);
    }
}
