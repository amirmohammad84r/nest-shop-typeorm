import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { LogConfig } from '../entities/logConfig';

@Injectable()
export class LogConfigRepository extends Repository<LogConfig> {
    constructor(private dataSource: DataSource) {
        super(LogConfig, dataSource.createEntityManager());
    }
    async findLogsConfig() {
        return await this.find();
    }
}
