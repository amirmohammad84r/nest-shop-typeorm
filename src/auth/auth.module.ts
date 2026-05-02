import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user';
import { UserRepository } from 'src/user/repositories/userRepository';
import { AuthGuard } from './auth.guard';
import { RedisModule } from 'src/redis/redis.module';
import { RabbitmqModule } from 'src/rabbitqm/rabbitqm.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, RabbitmqModule],
  providers: [AuthService, UserRepository, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard, UserRepository, AuthService]
})
export class AuthModule { }