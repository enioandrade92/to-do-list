import { INestApplication } from '@nestjs/common';
import { BaseTestFactory } from '../../factories/base-test.factory';
import { Repository } from 'typeorm';
import { Task } from '../../../src/modules/task/entities/task.entity';
import { TaskStatus } from '../../../src/modules/task/@types/task-status.enum';
import { User } from '../../../src/modules/user/entities/user.entity';

export class TasksTestFactory extends BaseTestFactory {
    constructor(
        protected app: INestApplication,
        protected taskRepository: Repository<Task>,
    ) {
        super(app, taskRepository);
    }

    public async createTasks(createdBy: User) {
        return await this.taskRepository.save([
            {
                title: 'title toDo',
                description: 'description',
                status: TaskStatus.TO_DO,
                createdBy,
            },
            {
                title: 'title inProgress',
                description: 'description',
                status: TaskStatus.IN_PROGRESS,
                createdBy,
            },
            {
                title: 'title completed',
                description: 'description',
                status: TaskStatus.COMPLETED,
                createdBy,
            },
        ]);
    }

    public async createTask(createdBy: User) {
        return await this.taskRepository.save({
            title: 'title toDo',
            description: 'description',
            status: TaskStatus.TO_DO,
            createdBy,
        });
    }
}
