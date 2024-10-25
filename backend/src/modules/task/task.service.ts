import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserJwtPayload } from '../auth/@types/user-jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { GetTasksFiltersDto } from './dto/get-tasks-filters.dto';
import { CreateSubTaskDto } from './dto/create-subtask.dto';

@Injectable()
export class TaskService {
    private readonly relationFields = { subtasks: true, createdBy: true };
    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, user: UserJwtPayload) {
        return await this.taskRepository.save({
            ...createTaskDto,
            createdBy: { id: user.id },
        });
    }

    async createSubtask(
        createSubTaskDto: CreateSubTaskDto,
        user: UserJwtPayload,
    ) {
        const parent = await this.taskRepository.findOneBy({
            id: createSubTaskDto.parent.id,
        });
        if (!parent)
            throw new NotFoundException(
                `task parent id: ${createSubTaskDto.parent.id}, not found`,
            );

        return await this.taskRepository.save({
            ...createSubTaskDto,
            createdBy: { id: user.id },
        });
    }

    async getTasks(filters: GetTasksFiltersDto) {
        const { page, limit } = filters;
        const findOptions: FindManyOptions<Task> = {
            order: { createdAt: filters?.order ?? 'DESC' },
            relations: this.relationFields,
            where: {
                parent: filters?.parent?.id
                    ? { id: filters.parent.id }
                    : IsNull(),
            },
        };

        if (filters?.status) {
            findOptions.where = {
                ...findOptions.where,
                status: filters.status,
            };
        }

        return await paginate(
            this.taskRepository,
            { page, limit },
            findOptions,
        );
    }

    async getTaskById(id: string) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: this.relationFields,
        });
        if (!task) throw new NotFoundException(`task id: ${id}, not found`);
        return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
        // In some cases it is necessary to verify who created it in order to edit it
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) throw new NotFoundException(`task id: ${id}, not found`);

        return await this.taskRepository.save({
            ...task,
            ...updateTaskDto,
        });
    }

    async removeTask(id: string) {
        // In some cases it is necessary to verify relations and who created it in order to remove it
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) throw new NotFoundException(`task id: ${id}, not found`);
        return await this.taskRepository.softRemove(task);
    }
}
