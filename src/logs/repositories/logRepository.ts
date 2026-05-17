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
        });
    }
    async deleteLogsByMaxItem(maxItem: string) {
        return await this.query(
            `
    DELETE FROM logs
    WHERE id IN (
      SELECT id
      FROM logs
      ORDER BY "createdAt" DESC
      OFFSET ${maxItem}
    );
    `);
    }

    async deleteLogsByDate(days: string) {
        return await this.query(
            `
    DELETE FROM logs
    WHERE "createdAt" < NOW() - (${days} * INTERVAL '1 days');
    `);
    }

}
