import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RefreshTokenDto } from '../../../src/modules/auth/dto/refresh-token.dto';
import { TokensDto } from '../../../src/modules/auth/dto/tokens.dto';
import { SignInDto } from '../../../src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from '../../../src/modules/auth/dto/sign-up.dto';
import { AuthTestFactory } from './auth-test.factory';
import { RepositoryFactory } from '../../factories/repository.factory';
import { createTestModule } from '../../factories/create-test-module.factory';

let mockTokens: TokensDto;

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let repositoryFactory: RepositoryFactory;
    let authTestFactory: AuthTestFactory;

    const ACCESS_TOKEN_PATTERN = /^[a-zA-Z0-9-_.]+$/;

    beforeAll(async () => {
        const res = await createTestModule();
        app = res.app;
        moduleRef = res.moduleRef;

        repositoryFactory = new RepositoryFactory(moduleRef);
        authTestFactory = new AuthTestFactory(app);

        await repositoryFactory.cleanUpDatabase();
    });

    afterAll(async () => {
        await repositoryFactory.cleanUpDatabase();
        await app.close();
        await moduleRef.close();
    });

    it('1 - should return a created user', async () => {
        const createUserDto: SignUpDto =
            authTestFactory.generateUser('auth@test.com.br');

        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(createUserDto);

        const expected = {
            access_token: expect.stringMatching(ACCESS_TOKEN_PATTERN),
            refresh_token: expect.stringMatching(ACCESS_TOKEN_PATTERN),
        };

        expect(response.body).toEqual(expected);
        expect(response.statusCode).toEqual(201);
    });

    it('2 - should return an error when user duplicate', async () => {
        const createUserDto: SignUpDto =
            authTestFactory.generateUser('auth@test.com.br');

        const response = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(createUserDto);
        expect(response.body.message).toEqual('Email already registered');
        expect(response.statusCode).toEqual(409);
    });

    it('3 - should return the tokens', async () => {
        const { email, password }: SignInDto =
            authTestFactory.generateUser('auth@test.com.br');

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ email, password });

        const expected = {
            access_token: expect.stringMatching(ACCESS_TOKEN_PATTERN),
            refresh_token: expect.stringMatching(ACCESS_TOKEN_PATTERN),
        };

        mockTokens = response.body;
        expect(response.body).toEqual(expected);
        expect(response.statusCode).toEqual(201);
    });

    it('4 - should return an Unauthorized error', async () => {
        const { email }: SignInDto =
            authTestFactory.generateUser('auth@test.com.br');

        const response = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ email, password: 'wrongPassword' });

        expect(response.body.message).toEqual('Email or password is incorrect');
        expect(response.statusCode).toEqual(400);
    });

    it('5 - should return a new access token', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/refresh-token')
            .send(<RefreshTokenDto>{ refreshToken: mockTokens.refresh_token });

        expect(response.body).toEqual({
            access_token: expect.stringMatching(ACCESS_TOKEN_PATTERN),
            refresh_token: mockTokens.refresh_token,
        });
        expect(response.statusCode).toEqual(201);
    });
});
