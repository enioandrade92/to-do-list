import { IsEnum, IsOptional } from 'class-validator';
import { PaginateAndOrderDto } from '../../../dto/paginate-order.dto';
import { TaskStatus } from '../@types/task-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTasksFiltersDto extends PaginateAndOrderDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: string;
}
