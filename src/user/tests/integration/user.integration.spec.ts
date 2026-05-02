jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { CommonService } from 'src/common/common.service';
import { RoleRepository } from 'src/user/repositories/roleRepository';
import { UserRepository } from 'src/user/repositories/userRepository';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

describe('user module intgration test', () => {
    let controller: UserController;
    let common: CommonService;

    const userRepo = {
        findUserByEmailRepo: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findAllUsersRepo: jest.fn(),
        findUserByIdRepo: jest.fn(),
        findUserByIdWithoutRel: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };

    const roleRepo = {
        findOneBy: jest.fn(),
        create: jest.fn(),
    };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                { provide: UserRepository, useValue: userRepo },
                { provide: RoleRepository, useValue: roleRepo },
                CommonService
            ],
        }).compile();

        controller = moduleRef.get(UserController);
        common = moduleRef.get(CommonService);
    });
    describe('create function', () => {
        it('should create user successfully (role exists)', async () => {
            const dto = {
                email: 'test@test.com',
                name: 'ali',
                password: '1234',
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            userRepo.findUserByEmailRepo.mockResolvedValue(null);
            roleRepo.findOneBy.mockResolvedValue({ id: 1, title: 'user' });

            const fakeUser = { id: 1 };

            userRepo.create.mockReturnValue({
                save: jest.fn().mockResolvedValue(fakeUser),
            });

            const result = await controller.createUser(dto);

            expect(result).toEqual({
                message: 'User created successfully',
                user: fakeUser,
            });
        });
        it('should throw ConflictException if email exists', async () => {
            userRepo.findUserByEmailRepo.mockResolvedValue({ id: 1 });

            await expect(
                controller.createUser({
                    email: 'test@test.com',
                    name: 'ali',
                    password: '1234',
                }),
            ).rejects.toThrow();
        });
        it('should create role if not exists', async () => {
            const dto = {
                email: 'test@test.com',
                name: 'ali',
                password: '1234',
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            userRepo.findUserByEmailRepo.mockResolvedValue(null);
            roleRepo.findOneBy.mockResolvedValue(null);

            const fakeRole = { id: 2, title: 'user' };

            roleRepo.create.mockReturnValue({
                save: jest.fn().mockResolvedValue(fakeRole),
            });

            const fakeUser = { id: 1 };

            userRepo.create.mockReturnValue({
                save: jest.fn().mockResolvedValue(fakeUser),
            });

            const result = await controller.createUser(dto);

            expect(result.user).toEqual(fakeUser);
        });
    });

    describe('get all users', () => {
        it('get all users successfully', async () => {
            userRepo.findAllUsersRepo.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const result = await controller.findAllUsers();
            expect(result).toEqual({
                message: 'Users retrieved successfully',
                users: [{ id: 1 }, { id: 2 }],
                total: 2,

            });
            expect(userRepo.findAllUsersRepo).toHaveBeenCalled();
        })
    })
    describe('get user by id', () => {
        it('get user by id successfully', async () => {
            userRepo.findUserByIdRepo.mockResolvedValue({ id: 1 });

            const result = await controller.findUserById('1');
            expect(result).toEqual({
                message: 'User retrieved successfully',
                user: { id: 1 },
            });
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('1');
        });

        it('fail to get user by id', async () => {
            userRepo.findUserByIdRepo.mockResolvedValue(null);
            expect(controller.findUserById('1')).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('1');
        })
    });

    describe('update user', () => {
        it('update user successfully', async () => {
            const dto: UpdateUserDto = {
                name: 'dcnsnv'
            }
            const req = {} as any;
            userRepo.findUserByIdWithoutRel
                .mockResolvedValueOnce({ id: 1, name: 'olama' })
                .mockResolvedValueOnce({ id: 1, name: 'dcnsnv' });
            jest.spyOn(common, 'combineDiffBeforeAfter');
            const resault = await controller.updateUser('1', dto, req)
            expect(resault).toEqual({
                message: 'User updated successfully',
                user: { id: 1, name: 'dcnsnv' },
            })
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledTimes(2)
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('1')
            expect(userRepo.update).toHaveBeenCalledWith('1', dto)
            expect(common.combineDiffBeforeAfter).toHaveBeenCalledWith({ id: 1, name: 'olama' }, { id: 1, name: 'dcnsnv' })
            expect(common.combineDiffBeforeAfter).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    name: 'olama',
                }),
                expect.objectContaining({
                    id: 1,
                    name: 'dcnsnv',
                }),
            );
        })
        it('fail update user', async () => {
            const dto: UpdateUserDto = {
                name: 'dcnsnv'
            }
            const req = {} as any;
            userRepo.findUserByIdWithoutRel.mockResolvedValue(null)
            await expect(controller.updateUser('1', dto, req)).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('1')
        })

        it('repeated email fail', async () => {
            const dto: UpdateUserDto = {
                email: 'asc@gmail.com',
                name: 'dcnsnv'
            }
            const req = {} as any;
            userRepo.findUserByIdWithoutRel.mockResolvedValue({ id: 1 })
            userRepo.findUserByEmailRepo.mockResolvedValue({ id: 2 })
            await expect(controller.updateUser('1', dto, req)).rejects.toThrow(ConflictException)
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('1')
        })

    })

    describe('delete user', () => {
        it('delete user successfully', async () => {
            userRepo.findUserByIdRepo.mockResolvedValue({ id: 1 })
            const resault = await controller.deleteUser('1')
            expect(resault).toEqual({
                message: 'User deleted successfully',
            })
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('1')
            expect(userRepo.delete).toHaveBeenCalledWith('1')
        })
        it('fail not found user', async () => {
            userRepo.findUserByIdRepo.mockResolvedValue(null)
            await expect(controller.deleteUser('1')).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('1')
        })
    })

});
