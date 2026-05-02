import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { UserRepository } from './repositories/userRepository';
import { Permitions } from './entities/permitions';
import { PermitionsReposotory } from './repositories/permitionRepository';
import { RolesTable } from './entities/role';
import { RoleRepository } from './repositories/roleRepository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permitions, RolesTable]), CommonModule],
  providers: [UserService, UserRepository, PermitionsReposotory, RoleRepository],
  controllers: [UserController],
})
export class UserModule { }
