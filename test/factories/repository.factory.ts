import { TestingModule } from '@nestjs/testing';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/modules/user/entities/user.entity';
import { Task } from '../../src/modules/task/entities/task.entity';

export class RepositoryFactory {
    constructor(private moduleRef: TestingModule) {}

    public user() {
        return this.moduleRef.get<Repository<User>>(getRepositoryToken(User));
    }

    public task() {
        return this.moduleRef.get<Repository<Task>>(getRepositoryToken(Task));
    }

    public async cleanUpDatabase() {
        const entityManager = this.moduleRef.get<EntityManager>(EntityManager);
        const tableNames = entityManager.connection.entityMetadatas
            .map((entity) => entity.tableName)
            .join(', ');

        await entityManager.query(
            `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
        );
    }
}
