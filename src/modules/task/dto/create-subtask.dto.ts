import { IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IdRelationDto } from '../../../dto/id-relation.dto';
import { CreateTaskDto } from './create-task.dto';

export class CreateSubTaskDto extends CreateTaskDto {
    @ApiProperty()
    @IsObject()
    @ValidateNested()
    @Type(() => IdRelationDto)
    parent: IdRelationDto;
}
