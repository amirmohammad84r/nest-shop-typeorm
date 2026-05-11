import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitqm.service';
import { UserRepository } from 'src/user/repositories/userRepository';
import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { RoleRepository } from 'src/user/repositories/roleRepository';


@Module({
  imports: [UserModule, RedisModule],
  providers: [RabbitmqService, UserRepository, RedisService, RoleRepository],
  exports: [RabbitmqService],
})
export class RabbitmqModule { }