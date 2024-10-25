import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import StringUtil from '../../../utils/string.util';

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => StringUtil.lowerCaseAndTrim(value))
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    name?: string;
}
