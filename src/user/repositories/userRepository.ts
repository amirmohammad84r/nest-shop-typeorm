import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { User } from '../entities/user';


@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAllUsersRepo() {
    return await this.find({ relations: ['role'] });
  }

  async findUserByIdRepo(id: string) {
    return await this.findOne({ where: { id }, relations: { role: true } });

  }

  async findUserByEmailRepo(email: string) {
    return this.findOne({ where: { email }, relations: ['role'] });
  }

  async findUserByIdWithoutRel(id: string) {
    return await this.findOne({ where: { id } });
  }

  async findAllUsersByName(name: string) {
    return await this.find({ where: { name: Like(`%${name}%`) } })
  }
}
