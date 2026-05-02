import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { UpdateUserDto } from "src/user/dto/update-user.dto"
import { UserController } from "src/user/user.controller"
import { UserService } from "src/user/user.service"


describe('userController (unit controller)', () => {
    let userController: UserController
    let userService: Partial<UserService>
    beforeAll(() => {
        userService = {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn()
        };
        userController = new UserController(userService as UserService);
    })
    describe('create User', () => {
        it('should return the user with role', async () => {
            const user: CreateUserDto = {
                email: 'ali@gmail.com',
                name: 'snuovbs',
                password: 'ndocnidscpsd'
            }
            const serviceResponse = {
                message: 'User created successfully',
                user: { ...user, role: 'user' }
            };
            (userService.createUser as jest.Mock).mockResolvedValue(serviceResponse);
            const result = await userController.createUser(user);
            expect(result).toEqual(
                serviceResponse,
            );
            expect(userService.createUser).toHaveBeenCalledWith(user);
        })
        it('should return the user exist already', async () => {
            const user: CreateUserDto = {
                email: 'ali@gmail.com',
                name: 'snuovbs',
                password: 'ndocnidscpsd'
            };
            (userService.createUser as jest.Mock).mockRejectedValue(new ConflictException());
            await expect(userController.createUser(user)).rejects.toThrow(ConflictException);
            expect(userService.createUser).toHaveBeenCalledWith(user);
        })
        it('User Role Not Created', async () => {
            const user: CreateUserDto = {
                email: 'ali@gmail.com',
                name: 'snuovbs',
                password: 'ndocnidscpsd'
            };
            (userService.createUser as jest.Mock).mockRejectedValue(new BadRequestException());
            await expect(userController.createUser(user)).rejects.toThrow(BadRequestException);
            expect(userService.createUser).toHaveBeenCalledWith(user);
        })
    })
    describe('find All User', () => {
        it('getAllUsersSucsussfuly', async () => {
            const serviceResponse = {
                "message": "Users retrieved successfully",
                "users": {},
                "total": Number
            };
            (userService.findAllUsers as jest.Mock).mockResolvedValue(serviceResponse);
            const result = await userController.findAllUsers();

            expect(result).toEqual(
                serviceResponse,
            );

            expect(userService.findAllUsers).toHaveBeenCalledWith();
        })
    })
    describe('find User By Id', () => {
        it('getUserByIdSucsussfuly', async () => {
            const serviceResponse = {
                "message": "User retrieved successfully",
                "user": {}
            };
            (userService.findUserById as jest.Mock).mockResolvedValue(serviceResponse);
            const result = await userController.findUserById('');
            expect(result).toEqual(
                serviceResponse,
            );
            expect(userService.findUserById).toHaveBeenCalledWith('');
        })
        it('faildToGetUserById', async () => {
            (userService.findUserById as jest.Mock).mockRejectedValue(new NotFoundException());
            await expect(userController.findUserById('')).rejects.toThrow(NotFoundException);
            expect(userService.findUserById).toHaveBeenCalledWith('');
        })
    })
    describe('update User', () => {
        it('sould return updated user', async () => {
            const response = {
                message: 'User updated successfully',
                user: {},
            };
            const newValue: UpdateUserDto = {
                name: 'ad'
            };
            (userService.updateUser as jest.Mock).mockResolvedValue(response);
            const resault = await userController.updateUser('', newValue, '')
            expect(resault).toEqual(response)
            expect(userService.updateUser).toHaveBeenCalledWith('', newValue, '');
        })
        it('sould throw conflict exeption', async () => {
            const newValue: UpdateUserDto = {
                name: 'ad'
            };
            (userService.updateUser as jest.Mock).mockRejectedValue(new ConflictException());

            await expect(userController.updateUser('', newValue, '')).rejects.toThrow(ConflictException)
            expect(userService.updateUser).toHaveBeenCalledWith('', newValue, '');
        })
    })
    describe('delete User', () => {
        it('should delete user', async () => {
            (userService.deleteUser as jest.Mock).mockResolvedValue({ message: 'User deleted successfully' })
            const resault = await userController.deleteUser('')
            expect(resault).toEqual({ message: 'User deleted successfully' })
            expect(userService.deleteUser).toHaveBeenCalledWith('')
        })
    })

})
