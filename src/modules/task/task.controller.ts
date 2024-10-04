import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseUUIDPipe,
    UseGuards,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTasksFiltersDto } from './dto/get-tasks-filters.dto';
import { Request } from 'express';
import { UserJwtPayload } from '../auth/@types/user-jwt-payload.type';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
        const user = request.user as UserJwtPayload;
        return this.taskService.createTask(createTaskDto, user);
    }

    @Get()
    async getTasks(@Query() filters: GetTasksFiltersDto) {
        return this.taskService.getTasks(filters);
    }

    @Get(':id')
    async getTaskById(@Param('id', ParseUUIDPipe) id: string) {
        return this.taskService.getTaskById(id);
    }

    @Put(':id')
    async updateTask(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    async removeTask(@Param('id', ParseUUIDPipe) id: string) {
        return this.taskService.removeTask(id);
    }
}
