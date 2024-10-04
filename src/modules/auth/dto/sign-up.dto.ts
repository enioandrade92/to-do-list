import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import StringUtil from '../../../utils/string.util';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty()
    @IsEmail()
    @Transform(({ value }) => StringUtil.lowerCaseAndTrim(value))
    email: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    password: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    name: string;
}
