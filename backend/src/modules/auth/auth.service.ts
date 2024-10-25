import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import BcryptUtil from './utils/bcrypt.util';
import JwtUtil from './utils/jwt.util';
import { SignInDto } from './dto/sign-in.dto';
import { UserJwtPayload } from './@types/user-jwt-payload.type';
import { User } from '../user/entities/user.entity';
import { Tokens } from './@types/tokens.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    private readonly userSelectFields: FindOptionsSelect<User> = {
        id: true,
        name: true,
        email: true,
        password: true,
    };

    async validateCredentials({
        email,
        password,
    }: SignInDto): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: this.userSelectFields,
        });
        if (!user) {
            throw new NotFoundException('Email or password is incorrect');
        }

        const isPasswordValid = await BcryptUtil.comparePassword(
            password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Email or password is incorrect');
        }

        delete user.password;

        return user;
    }

    async generateAuthTokens(user: Partial<User>): Promise<Tokens> {
        const payload: UserJwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const tokens = {
            access_token: JwtUtil.getAccessToken(payload),
            refresh_token: JwtUtil.getRefreshToken(payload),
        };

        return tokens;
    }

    async refreshToken(token: string): Promise<Tokens> {
        JwtUtil.verifyToken(token);
        const decoded = JwtUtil.decodeToken(token);
        delete decoded.exp;
        delete decoded.iat;

        const tokens = {
            access_token: JwtUtil.getAccessToken(decoded),
            refresh_token: token,
        };

        return tokens;
    }
}
