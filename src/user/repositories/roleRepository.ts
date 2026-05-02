import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RolesTable } from '../entities/role';

@Injectable()
export class RoleRepository extends Repository<RolesTable> {
    constructor(private dataSource: DataSource) {
        super(RolesTable, dataSource.createEntityManager());
    }
    async findAll() {
        return await this.find({ relations: ['permitions'] })
    }
    async findRoleById(id: string) {
        return await this.findOne({ where: { id }, relations: ['permitions'] })
    }
    async findByTitle(title: string) {
        return await this.findOneBy({ title })
    }

}
