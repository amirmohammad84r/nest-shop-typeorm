import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Carts } from '../entities/cart';

@Injectable()
export class CartRepository extends Repository<Carts> {
  constructor(private dataSource: DataSource) {
    super(Carts, dataSource.createEntityManager());
  }
  async findCartByUserId(userId: string) {
    return this.findOne({
      where: { userId },
      relations: ['cartItems', 'user'],
    });
  }
  async findAllCarts(){
    return this.find()
  }
}
