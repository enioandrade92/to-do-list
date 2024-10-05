import {
    Body,
    Controller,
    UseGuards,
    Put,
    Get,
    Req,
    ParseUUIDPipe,
    Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { UserJwtPayload } from '../auth/@types/user-jwt-payload.type';
import { UsersService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() request: Request): Promise<Partial<User>> {
        const { id } = request.user as UserJwtPayload;
        return await this.usersService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateMe(
        @Req() request: Request,
        @Body() updateUseDto: UpdateUserDto,
    ): Promise<Partial<User>> {
        const { id } = request.user as UserJwtPayload;
        const user = await this.usersService.updateUserById(id, updateUseDto);

        return user;
    }
}
