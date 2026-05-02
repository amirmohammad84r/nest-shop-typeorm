import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Permitions } from '../entities/permitions';

@Injectable()
export class PermitionsReposotory extends Repository<Permitions> {
    constructor(private dataSource: DataSource) {
        super(Permitions, dataSource.createEntityManager());
    }

    async findPermitionById(id: string) {
        return this.findOneBy({ id })
    }
    async findPermitionByTitle(title: string) {
        return this.findOneBy({ title })
    }
}
