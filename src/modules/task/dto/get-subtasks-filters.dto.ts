import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdRelationDto } from '../../../dto/id-relation.dto';
import { GetTasksFiltersDto } from './get-tasks-filters.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSubTasksFiltersDto extends GetTasksFiltersDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => IdRelationDto)
    parent: Record<string, string>;
}
