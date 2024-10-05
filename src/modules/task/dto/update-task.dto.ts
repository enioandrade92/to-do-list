import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../@types/task-status.enum';

export class UpdateTaskDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional({
        type: 'enum',
        enum: TaskStatus,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
