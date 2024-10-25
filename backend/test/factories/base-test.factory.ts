import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { SignUpDto } from '../../src/modules/auth/dto/sign-up.dto';

export abstract class BaseTestFactory {
    constructor(
        protected app: INestApplication,
        protected repository?: Repository<any>,
    ) {}

    public generateUser(email: string) {
        return {
            email: email,
            password: '123456789',
            name: 'name',
        };
    }

    public async singUpByEmail(email: string) {
        const user = this.generateUser(email);
        const response = await request(this.app.getHttpServer())
            .post('/auth/sign-up')
            .send(user);
        return response.body;
    }

    public async singUpByUser(user: SignUpDto) {
        const response = await request(this.app.getHttpServer())
            .post('/auth/sign-up')
            .send(user);

        return response.body;
    }

    public async singIn(email: string, password: string = '123456789') {
        const response = await request(this.app.getHttpServer())
            .post('/auth/sign-in')
            .send({ email, password });

        return response.body;
    }

    public async getUserMe(accessToken: string) {
        const response = await request(this.app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${accessToken}`);

        return response.body;
    }
}
