import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
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
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
                .expect(201);
            expect(res.body).toBeDefined();
        })

        it('get users', async () => {
            const res = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
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
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
                .expect(201);

            const id = res1.body.user.id

            const res = await request(app.getHttpServer())
                .get(`/users/${id}`)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
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
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
                .expect(201);
            const id = res1.body.user.id


            const udto: UpdateUserDto = {
                name: 'test1'
            }

            const res = await request(app.getHttpServer())
                .put(`/users/${id}`)
                .send(udto)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
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
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
                .expect(201);
            const id = res1.body.user.id


            const res = await request(app.getHttpServer())
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODk5NjFlOS1iOThjLTRjZTMtOTlmMi1hMjYzMGRkZDllYjYiLCJyb2xlIjp7ImlkIjoiODY3ZDk0YmUtY2M2My00YzU2LTg5YWQtNTVhZmZiYzU0MjM5IiwidHlwZSI6InVzZXIiLCJ0aXRsZSI6InVzZXIiLCJjcmVhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA1LTExVDA4OjA5OjA4LjE5OFoifSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzc4NDk5NzQ4LCJleHAiOjE3NzkxMDQ1NDh9.QNFiFmrhmf3xFsaGqTko3H0U6U95oTXNixSQ-6sGQW0`)
                .expect(200);
            expect(res.body).toBeDefined();
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
