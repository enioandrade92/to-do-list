import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserJwtPayload } from '../auth/@types/user-jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { GetTasksFiltersDto } from './dto/get-tasks-filters.dto';
import { GetSubTasksFiltersDto } from './dto/get-subtasks-filters.dto';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private repositoryTask: Repository<Task>) {}

    async createTask(createTaskDto: CreateTaskDto, user: UserJwtPayload) {
        return await this.repositoryTask.save({
            ...createTaskDto,
            createdBy: { id: user.id },
        });
    }

    async getTasks(filters: GetTasksFiltersDto) {
        const { page, limit } = filters;
        const findOptions: FindManyOptions<Task> = {
            where: {
                parent: IsNull(),
            },
            order: { createdAt: filters.order ?? 'DESC' },
        };

        return paginate(this.repositoryTask, { page, limit }, findOptions);
    }

    async getSubTasks(filters: GetSubTasksFiltersDto) {
        const { page, limit } = filters;
        const findOptions: FindManyOptions<Task> = {
            where: {
                parent: { id: filters.parent.id },
            },
            order: { createdAt: filters.order ?? 'DESC' },
        };

        return paginate(this.repositoryTask, { page, limit }, findOptions);
    }

    async getTaskById(id: string) {
        const task = await this.repositoryTask.findOneBy({ id });
        if (!task) throw new NotFoundException(`task id: ${id}, not found`);
        return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
        return `This action updates a #${id} task`;
    }

    async removeTask(id: string) {
        return `This action removes a #${id} task`;
    }
}
