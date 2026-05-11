import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/userRepository';
import { RoleRepository } from './repositories/roleRepository';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepoCus: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly common: CommonService
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userRepoCus.findUserByEmailRepo(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let userRole = await this.roleRepo.findOneBy({ title: 'user' })
    if (!userRole) {
      userRole = await this.roleRepo.create({ title: "user" }).save()
    }
    if (!userRole) {
      throw new BadRequestException("sorry try again")
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepoCus.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
      role: userRole
    }).save();
    return {
      message: 'User created successfully',
      user,
    };
  }

  async findAllUsers() {
    const users = await this.userRepoCus.findAllUsersRepo();
    return {
      message: 'Users retrieved successfully',
      users,
      total: users.length,
    };
  }

  async findUserById(id: string) {
    const user = await this.userRepoCus.findUserByIdRepo(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, req: any) {
    const beforeUser = await this.userRepoCus.findUserByIdWithoutRel(id)
    if (!beforeUser) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email) {
      const existingUser = await this.userRepoCus.findUserByEmailRepo(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already taken by another user');
      }
    }
    await this.userRepoCus.update(id, updateUserDto);
    const user = await this.userRepoCus.findUserByIdWithoutRel(id)
    req.changes = this.common.combineDiffBeforeAfter(beforeUser, user)
    return {
      message: 'User updated successfully',
      user,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepoCus.findUserByIdRepo(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepoCus.delete(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
