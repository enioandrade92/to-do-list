import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import StringUtil from '../../../utils/string.util';

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => StringUtil.lowerCaseAndTrim(value))
    email: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => StringUtil.trim(value))
    password: string;
}
