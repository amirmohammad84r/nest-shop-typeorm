import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './entities/logTable';
import { LoggingInterceptor } from './logging.interceptor';
import { LogsRepository } from './repositories/logRepository';
import { CommonController } from './Logs.controller';
import { LogsService } from './logs.service';
import { UserRepository } from 'src/user/repositories/userRepository';
import { User } from 'src/user/entities/user';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([Logs, User]), CommonModule],
    providers: [LoggingInterceptor, LogsRepository, LogsService, UserRepository],
    controllers: [CommonController],
    exports: [LogsService]
})
export class LogsModule { }
