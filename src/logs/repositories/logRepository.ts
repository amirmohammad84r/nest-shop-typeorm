import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Logs } from '../entities/logTable';

@Injectable()
export class LogsRepository extends Repository<Logs> {
    constructor(private dataSource: DataSource) {
        super(Logs, dataSource.createEntityManager());
    }
    async findAllLogs(where: any) {
        return await this.find({
            where: [
                where
            ], relations: ['user']
        })
    }
}
