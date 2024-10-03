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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { JwtPayload } from '../auth/@types/jwt-payload.type';
import { UsersService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() request: Request): Promise<Partial<User>> {
        const { id } = request.user as JwtPayload;
        return await this.usersService.getUserById(id);
    }

    @Get(':userId')
    async getUserById(@Param('userId') userId: string): Promise<Partial<User>> {
        return await this.usersService.getUserById(userId);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    async updateMe(
        @Req() request: Request,
        @Body() updateUseDto: UpdateUserDto,
    ): Promise<Partial<User>> {
        const { id } = request.user as JwtPayload;
        const user = await this.usersService.updateUserById(id, updateUseDto);

        return user;
    }

    @Put(':userId')
    async updateUserById(
        @Param('userId') userId: string,
        @Body() updateUseDto: UpdateUserDto,
    ): Promise<Partial<User>> {
        const user = await this.usersService.updateUserById(
            userId,
            updateUseDto,
        );

        return user;
    }
}
