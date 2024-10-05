import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginateAndOrderDto } from '../../../dto/paginate-order.dto';
import { TaskStatus } from '../@types/task-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IdRelationDto } from '../../../dto/id-relation.dto';
import { Type } from 'class-transformer';

export class GetTasksFiltersDto extends PaginateAndOrderDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => IdRelationDto)
    parent?: IdRelationDto;
}
