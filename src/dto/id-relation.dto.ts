import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdRelationDto {
    @ApiPropertyOptional()
    @IsUUID()
    id: string;
}
