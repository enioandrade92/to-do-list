import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginateAndOrderDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    order?: 'ASC' | 'DESC' | 'asc' | 'desc';

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    page? = '1';

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    limit? = '10';
}
