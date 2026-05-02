import { CommonService } from "src/common/common.service"
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "src/user/dto/update-user.dto";
import { RoleRepository } from "src/user/repositories/roleRepository";
import { UserRepository } from "src/user/repositories/userRepository";
import { UserService } from "src/user/user.service";


describe('user service tests', () => {
    let userService: UserService
    let userRepo: Partial<UserRepository>
    let roleRepo: Partial<RoleRepository>
    let common: Partial<CommonService>

    beforeEach(() => {
        userRepo = {
            findAllUsersRepo: jest.fn(),
            findUserByIdRepo: jest.fn(),
            findUserByEmailRepo: jest.fn(),
            findUserByIdWithoutRel: jest.fn(),
            findAllUsersByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        roleRepo = {
            findAll: jest.fn(),
            findRoleById: jest.fn(),
            findByTitle: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn()
        };
        common = {
            combineDiffBeforeAfter: jest.fn(),
            findModuleByFAName: jest.fn()
        };
        userService = new UserService(
            userRepo as UserRepository,
            roleRepo as RoleRepository,
            common as CommonService
        );

    })
    describe('create user service', () => {
        it('should create user successfully when role exists', async () => {
            const dto = {
                email: 'test@test.com',
                name: 'ali',
                password: '1234',
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            (userRepo.findUserByEmailRepo as jest.Mock).mockResolvedValue(null);
            (roleRepo.findOneBy as jest.Mock).mockResolvedValue({ id: 1, title: 'user' });

            const fakeUser = { id: 1 };

            const saveMock = jest.fn().mockResolvedValue(fakeUser);

            (userRepo.create as jest.Mock).mockReturnValue({
                save: saveMock,
            });

            const result = await userService.createUser(dto);

            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(userRepo.findUserByEmailRepo).toHaveBeenCalledWith(dto.email);
            expect(roleRepo.findOneBy).toHaveBeenCalledWith({ title: 'user' });
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'User created successfully',
                user: fakeUser,
            });
        });
        it('should throw conflict exeption', async () => {
            const dto = {
                email: 'test@test.com',
                name: 'ali',
                password: '1234',
            };
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
            (userRepo.findUserByEmailRepo as jest.Mock).mockResolvedValue({ id: 1 });
            await expect(
                userService.createUser(dto),
            ).rejects.toThrow(ConflictException);
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(userRepo.findUserByEmailRepo).toHaveBeenCalledWith(dto.email);
        });
    });

    describe('find all users', () => {
        it('ok', async () => {
            (userRepo.findAllUsersRepo as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])
            const resault = await userService.findAllUsers()
            expect(resault).toEqual({
                message: 'Users retrieved successfully',
                users: [{ id: 1 }, { id: 2 }, { id: 3 }],
                total: 3,
            })
            expect(userRepo.findAllUsersRepo).toHaveBeenCalled()
        })
    })

    describe('find user by id', () => {
        it('successfully', async () => {
            (userRepo.findUserByIdRepo as jest.Mock).mockResolvedValue({})
            const resault = await userService.findUserById('')
            expect(resault).toEqual({
                message: 'User retrieved successfully',
                user: {},
            })
            expect(userRepo.findUserByIdRepo).toHaveBeenCalled()
        })
        it('fail', async () => {
            (userRepo.findUserByIdRepo as jest.Mock).mockResolvedValue(null)
            await expect(userService.findUserById('')).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdRepo).toHaveBeenCalled()
        })
    })

    describe('update user', () => {
        it('successfully', async () => {
            const dto: UpdateUserDto = {
                name: 'karim'
            };
            (userRepo.findUserByIdWithoutRel as jest.Mock).mockResolvedValue({ id: 1 });
            (userRepo.update as jest.Mock).mockResolvedValue({ id: 1 });
            (common.combineDiffBeforeAfter as jest.Mock).mockResolvedValue({ before: { name: 'ali' }, after: { name: 'karim' } });
            const resault = await userService.updateUser('vev', dto, {})
            expect(resault).toEqual({
                message: 'User updated successfully',
                user: { id: 1 },
            })
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('vev')
            expect(userRepo.update).toHaveBeenCalledWith('vev', dto)
            expect(common.combineDiffBeforeAfter).toHaveBeenCalled()
        })
        it('successfully but with email check', async () => {
            const dto: UpdateUserDto = {
                email: 'aeo@gmail.com',
                name: 'karim'
            };
            (userRepo.findUserByIdWithoutRel as jest.Mock).mockResolvedValue({ id: 1 });
            (userRepo.findUserByEmailRepo as jest.Mock).mockResolvedValue(null);
            (userRepo.update as jest.Mock).mockResolvedValue({ id: 1 });
            (common.combineDiffBeforeAfter as jest.Mock).mockResolvedValue({ before: { name: 'ali' }, after: { name: 'karim' } });
            const resault = await userService.updateUser('vev', dto, {})
            expect(resault).toEqual({
                message: 'User updated successfully',
                user: { id: 1 },
            })
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('vev')
            expect(userRepo.findUserByEmailRepo).toHaveBeenCalledWith(dto.email)
            expect(userRepo.update).toHaveBeenCalledWith('vev', dto)
            expect(common.combineDiffBeforeAfter).toHaveBeenCalled()
        })
        it('fail with email check', async () => {
            const dto: UpdateUserDto = {
                email: 'aeo@gmail.com',
                name: 'karim'
            };
            (userRepo.findUserByIdWithoutRel as jest.Mock).mockResolvedValue({ id: 1 });
            (userRepo.findUserByEmailRepo as jest.Mock).mockResolvedValue({ id: '1' });

            await expect(userService.updateUser('vev', dto, {})).rejects.toThrow(ConflictException)
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('vev')
            expect(userRepo.findUserByEmailRepo).toHaveBeenCalledWith(dto.email)
        })
        it('fail with email check', async () => {
            const dto: UpdateUserDto = {
                email: 'aeo@gmail.com',
                name: 'karim'
            };
            (userRepo.findUserByIdWithoutRel as jest.Mock).mockResolvedValue(null);

            await expect(userService.updateUser('vev', dto, {})).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdWithoutRel).toHaveBeenCalledWith('vev')
        })
    })

    describe('delete user', () => {
        it('successfully', async () => {
            (userRepo.findUserByIdRepo as jest.Mock).mockResolvedValue({ id: 1 });
            (userRepo.delete as jest.Mock).mockResolvedValue({ id: 1 });
            const resault = await userService.deleteUser('ee')
            expect(resault).toEqual({
                message: 'User deleted successfully',
            })
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('ee')
            expect(userRepo.delete).toHaveBeenCalledWith('ee')
        })
        it('fail', async () => {
            (userRepo.findUserByIdRepo as jest.Mock).mockResolvedValue(null);
            await expect(userService.deleteUser('ee')).rejects.toThrow(NotFoundException)
            expect(userRepo.findUserByIdRepo).toHaveBeenCalledWith('ee')
        })
    })


    afterEach(() => {
        jest.clearAllMocks();
    });
});
