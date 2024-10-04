import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import StringUtil from '../../../utils/string.util';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty()
    @IsEmail()
    @Transform(({ value }) => StringUtil.lowerCaseAndTrim(value))
    email: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    password: string;
}
