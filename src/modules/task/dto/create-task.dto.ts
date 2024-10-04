import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../@types/task-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiPropertyOptional()
    @IsEnum(TaskStatus)
    @IsOptional()
    status = TaskStatus.TO_DO;
}
