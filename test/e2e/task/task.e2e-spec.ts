import * as request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RepositoryFactory } from '../../factories/repository.factory';
import { createTestModule } from '../../factories/create-test-module.factory';
import { TasksTestFactory } from './task-test.factory';
import { TaskStatus } from '../../../src/modules/task/@types/task-status.enum';
import { Task } from '../../../src/modules/task/entities/task.entity';
import { User } from '../../../src/modules/user/entities/user.entity';
import { Tokens } from '../../../src/modules/auth/@types/tokens.type';

describe('Task (e2e)', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let repositoryFactory: RepositoryFactory;
    let taskTestFactory: TasksTestFactory;
    let MOCK_TOKENS: Tokens;
    let FAKE_UUID: string = 'fa7c3b89-5a10-45b5-a5d6-59b10c285149';
    let baseUser: User;
    let baseTask: Task;

    beforeAll(async () => {
        const res = await createTestModule();
        app = res.app;
        moduleRef = res.moduleRef;

        repositoryFactory = new RepositoryFactory(moduleRef);
        taskTestFactory = new TasksTestFactory(app, repositoryFactory.task());

        await repositoryFactory.cleanUpDatabase();

        MOCK_TOKENS = await taskTestFactory.singUpByEmail('user@test.com');
        baseUser = await taskTestFactory.getUserMe(MOCK_TOKENS.access_token);
    });

    afterAll(async () => {
        await repositoryFactory.cleanUpDatabase();
        await app.close();
        await moduleRef.close();
    });

    describe('1 - POST /tasks', () => {
        it('1.1 - should return a created task', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'title',
                    description: 'description',
                    status: TaskStatus.TO_DO,
                });

            expect(body).toEqual({
                title: 'title',
                description: 'description',
                status: 'toDo',
                createdBy: expect.objectContaining({
                    id: expect.any(String),
                }),
                id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
            });
            expect(statusCode).toBe(201);
            baseTask = body;
        });

        it('1.2 - should return an error when fields are incorrect', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
                    description: 1,
                    status: 1,
                });

            expect(body.message).toEqual([
                'title must be shorter than or equal to 100 characters',
                'description must be a string',
                'status must be one of the following values: toDo, inProgress, completed, onHold, canceled, archived',
            ]);
            expect(statusCode).toBe(400);
        });

        it('1.3 - should return an error when tokens not sent', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post('/tasks')
                .send({
                    title: 'title',
                    description: 'description',
                    status: TaskStatus.TO_DO,
                });

            expect(body).toEqual({
                error: 'Forbidden',
                message: 'Forbidden resource',
                statusCode: 403,
            });
            expect(statusCode).toBe(403);
        });
    });

    describe('2 - GET /tasks', () => {
        it('2.1 - should return a task', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.items).toEqual([
                {
                    id: expect.any(String),
                    title: 'title',
                    description: 'description',
                    status: 'toDo',
                    createdBy: expect.objectContaining({
                        id: expect.any(String),
                    }),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    subtasks: [],
                    deletedAt: null,
                },
            ]);
            expect(statusCode).toBe(200);
        });

        it('2.2 - should return an empty array when not exist', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .query({
                    status: TaskStatus.ARCHIVED,
                });

            expect(body.items).toEqual([]);
            expect(statusCode).toBe(200);
        });

        it('2.3 - should return a filtered task by status', async () => {
            await taskTestFactory.createTasks(baseUser);
            const { statusCode, body } = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .query({
                    status: TaskStatus.COMPLETED,
                });

            expect(body.items).toEqual([
                {
                    description: 'description',
                    status: 'completed',
                    subtasks: [],
                    title: 'title completed',
                    createdBy: expect.objectContaining({
                        id: expect.any(String),
                    }),
                    id: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    deletedAt: null,
                },
            ]);
            expect(statusCode).toBe(200);
        });
    });

    describe('3 - GET tasks/:id', () => {
        it('3.1 - should return a task by id', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get(`/tasks/${baseTask.id}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body).toEqual({
                id: expect.any(String),
                title: 'title',
                description: 'description',
                status: 'toDo',
                createdBy: expect.objectContaining({
                    id: expect.any(String),
                }),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                subtasks: [],
                deletedAt: null,
            });
            expect(statusCode).toBe(200);
        });

        it('3.2 - should return an error when uuid is not valid', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get('/tasks/uuid-not-valid')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(
                'Validation failed (uuid is expected)',
            );
            expect(statusCode).toBe(400);
        });

        it('3.3 - should return an error when not found task', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get(`/tasks/${FAKE_UUID}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(`task id: ${FAKE_UUID}, not found`);
            expect(statusCode).toBe(404);
        });
    });

    describe('4 - PUT /tasks/:id', () => {
        it('4.1 - should return an edited task by id', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .put(`/tasks/${baseTask.id}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'edited title',
                    description: 'edited description',
                    status: TaskStatus.COMPLETED,
                });

            expect(body).toEqual({
                id: expect.any(String),
                title: 'edited title',
                description: 'edited description',
                status: 'completed',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
            });
            expect(statusCode).toBe(200);
        });

        it('4.2 - should return an error when uuid is not valid', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .put('/tasks/uuid-not-valid')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(
                'Validation failed (uuid is expected)',
            );
            expect(statusCode).toBe(400);
        });

        it('4.3 - should return an error when not found task', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .put(`/tasks/${FAKE_UUID}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(`task id: ${FAKE_UUID}, not found`);
            expect(statusCode).toBe(404);
        });
    });

    describe('5 - DELETE /tasks/:id', () => {
        it('5.1 - should return a removed task by id', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .delete(`/tasks/${baseTask.id}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'edited title',
                    description: 'edited description',
                    status: TaskStatus.COMPLETED,
                });

            expect(body).toEqual({
                id: expect.any(String),
                title: 'edited title',
                description: 'edited description',
                status: 'completed',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: expect.any(String),
            });
            expect(statusCode).toBe(200);
        });

        it('5.2 - should return an error when uuid is not valid', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .delete('/tasks/uuid-not-valid')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(
                'Validation failed (uuid is expected)',
            );
            expect(statusCode).toBe(400);
        });

        it('5.3 - should return an error when the task has already been removed', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .delete(`/tasks/${baseTask.id}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body.message).toEqual(`task id: ${baseTask.id}, not found`);
            expect(statusCode).toBe(404);
        });
    });

    describe('6 - POST /tasks/subtask', () => {
        it('6.1 - should return a created subtask', async () => {
            baseTask = await taskTestFactory.createTask(baseUser);
            const { statusCode, body } = await request(app.getHttpServer())
                .post(`/tasks/subtask`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'subtask title',
                    description: 'subtask description',
                    status: TaskStatus.TO_DO,
                    parent: { id: baseTask.id },
                });

            expect(body).toEqual({
                id: expect.any(String),
                title: 'subtask title',
                description: 'subtask description',
                status: TaskStatus.TO_DO,
                createdBy: { id: baseUser.id },
                parent: { id: baseTask.id },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
            });
            expect(statusCode).toBe(201);
        });

        it('6.2 - should return an error when parent is not sent', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post(`/tasks/subtask`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'subtask title',
                    description: 'subtask description',
                    status: TaskStatus.TO_DO,
                });

            expect(body.message).toEqual(['parent must be an object']);
            expect(statusCode).toBe(400);
        });

        it('6.3 - should return an error when parent is not found', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post(`/tasks/subtask`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    title: 'subtask title',
                    description: 'subtask description',
                    status: TaskStatus.TO_DO,
                    parent: { id: FAKE_UUID },
                });

            expect(body.message).toEqual(
                `task parent id: ${FAKE_UUID}, not found`,
            );
            expect(statusCode).toBe(404);
        });
    });

    describe('7 - GET /tasks', () => {
        it('7.1 - should return a subtask by task id', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get(`/tasks`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .query({
                    parent: { id: baseTask.id },
                });

            expect(body.items).toEqual([
                {
                    id: expect.any(String),
                    title: 'subtask title',
                    description: 'subtask description',
                    status: TaskStatus.TO_DO,
                    createdBy: expect.objectContaining({ id: baseUser.id }),
                    subtasks: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    deletedAt: null,
                },
            ]);
            expect(statusCode).toBe(200);
        });

        it('7.2 - should return a task by id and subtasks relations', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .get(`/tasks/${baseTask.id}`)
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body).toEqual({
                id: expect.any(String),
                title: 'title toDo',
                description: 'description',
                status: TaskStatus.TO_DO,
                createdBy: expect.objectContaining({ id: baseUser.id }),
                subtasks: [
                    {
                        id: expect.any(String),
                        title: 'subtask title',
                        description: 'subtask description',
                        status: TaskStatus.TO_DO,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        deletedAt: null,
                    },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
            });
            expect(statusCode).toBe(200);
        });
    });
});
