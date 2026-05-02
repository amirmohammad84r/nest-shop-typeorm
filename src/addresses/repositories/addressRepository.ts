import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Addresses } from '../entities/adresses';

@Injectable()
export class AddressesRepository extends Repository<Addresses> {
  constructor(private dataSource: DataSource) {
    super(Addresses, dataSource.createEntityManager());
  }
  async findAllAddresses() {
    return this.find();
  }
  async findAddressById(id: string, userId: string) {
    return this.findOne({ where: { id, userId } });
  }
}
