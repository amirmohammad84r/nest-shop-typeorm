import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/repositories/userRepository';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';
const request = require('supertest');


describe('User E2E', () => {
    let app: INestApplication;
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = moduleRef.createNestApplication();
        await app.init();
    });

    describe('users e2e', () => {

        it('create user', async () => {
            const dto: CreateUserDto = {
                email: 'test@gmail.com',
                name: 'test',
                password: 'password123'
            };
            const res = await request(app.getHttpServer())
                .post('/users')
                .send(dto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(201);
            expect(res.body).toBeDefined();
        })

        it('get users', async () => {
            const res = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(200);
            expect(res.body).toBeDefined();
        })

        it('get by id', async () => {
            const dto: CreateUserDto = {
                email: 'test1@gmail.com',
                name: 'test',
                password: 'password123'
            };
            const res1 = await request(app.getHttpServer())
                .post('/users')
                .send(dto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(201);

            const id = res1.body.user.id

            const res = await request(app.getHttpServer())
                .get(`/users/${id}`)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(200);
            console.error(res.body)
            expect(res.body).toBeDefined();
        })

        it('update by id', async () => {
            const dto: CreateUserDto = {
                email: 'test2@gmail.com',
                name: 'test',
                password: 'password123'
            };
            const res1 = await request(app.getHttpServer())
                .post('/users')
                .send(dto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(201);
            const id = res1.body.user.id


            const udto: UpdateUserDto = {
                name: 'test1'
            }

            const res = await request(app.getHttpServer())
                .put(`/users/${id}`)
                .send(udto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(200);
            expect(res.body).toBeDefined();
        })

        it('delete by id', async () => {
            const dto: CreateUserDto = {
                email: 'test3@gmail.com',
                name: 'test',
                password: 'password123'
            };
            const res1 = await request(app.getHttpServer())
                .post('/users')
                .send(dto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(201);
            const id = res1.body.user.id


            const res = await request(app.getHttpServer())
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk2ZDIwOS02N2JiLTQ4NzItOGNiOS0xMjE5MTQzOWM3OTIiLCJyb2xlIjpudWxsLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3Nzc3MDEzNDcsImV4cCI6MTc3ODMwNjE0N30.6riaoFr67M-RcVSWR7jJWfb82yskZEKc6modRnIEWWI`)
                .expect(200);
            expect(res.body).toBeDefined();
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
