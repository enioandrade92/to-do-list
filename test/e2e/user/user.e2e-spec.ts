import * as request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TokensDto } from '../../../src/modules/auth/dto/tokens.dto';
import { RepositoryFactory } from '../../factories/repository.factory';
import { createTestModule } from '../../factories/create-test-module.factory';
import { UsersTestFactory } from './user-test.factory';

describe('User (e2e)', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let repositoryFactory: RepositoryFactory;
    let userTestFactory: UsersTestFactory;
    let MOCK_TOKENS: TokensDto;

    beforeAll(async () => {
        const res = await createTestModule();
        app = res.app;
        moduleRef = res.moduleRef;

        repositoryFactory = new RepositoryFactory(moduleRef);
        userTestFactory = new UsersTestFactory(app, repositoryFactory.task());

        await repositoryFactory.cleanUpDatabase();
        MOCK_TOKENS = await userTestFactory.singUpByEmail('user@test.com');
    });

    afterAll(async () => {
        await repositoryFactory.cleanUpDatabase();
        await app.close();
        await moduleRef.close();
    });

    describe('1 - /PUT users/:userId', () => {
        it('1.1 - should update a user and return it', async () => {
            const updatedTestEmail = 'update@test-success.com';

            const response = await request(app.getHttpServer())
                .put('/users/me')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    email: updatedTestEmail,
                });

            expect(response.body).toEqual({
                id: expect.any(String),
                email: updatedTestEmail,
                name: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
            expect(response.statusCode).toBe(200);
        });

        it('1.2 - should return an error if fields are incorrect', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .put('/users/me')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`)
                .send({
                    email: 'update',
                    name: 3,
                });

            expect(body).toEqual({
                message: ['email must be an email', 'name must be a string'],
                error: 'Bad Request',
                statusCode: 400,
            });
            expect(statusCode).toBe(400);
        });
    });

    describe('2 - /GET users/me', () => {
        it('2.1 - should return a user data', async () => {
            MOCK_TOKENS =
                await userTestFactory.singUpByEmail('me@users.com.br');

            const { statusCode, body } = await request(app.getHttpServer())
                .get('/users/me')
                .set('Authorization', `Bearer ${MOCK_TOKENS.access_token}`);

            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    email: 'me@users.com.br',
                    name: 'name',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            );
            expect(statusCode).toBe(200);
        });
    });
});
