import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import BcryptUtil from '../auth/utils/bcrypt.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    private readonly userSelectFields = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    };

    async create(createUserDto: SignUpDto): Promise<Partial<User>> {
        const checkExist = await this.usersRepository.findOneBy({
            email: createUserDto.email,
        });
        if (checkExist) throw new ConflictException('Email already registered');

        const { hashedPassword } = await BcryptUtil.encodePassword(
            createUserDto.password,
        );

        const integrationToken = createHash('md5')
            .update(createUserDto.email + new Date().toISOString())
            .digest('hex');

        const user = await this.usersRepository.save({
            ...createUserDto,
            password: hashedPassword,
            integrationToken,
        });

        return user;
    }

    async getUserById(id: string): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({
            select: this.userSelectFields,
            where: { id },
        });
        if (!user) throw new NotFoundException('User does not found');

        return user;
    }

    async updateUserById(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: this.userSelectFields,
        });

        if (updateUserDto?.password) {
            const { hashedPassword } = await BcryptUtil.encodePassword(
                updateUserDto.password,
            );
            updateUserDto.password = hashedPassword;
        }

        const updatedUser = await this.usersRepository.save({
            ...user,
            ...updateUserDto,
        });

        delete updatedUser.password;

        return updatedUser;
    }
}
