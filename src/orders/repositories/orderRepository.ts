import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/orders';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
  async findOrderByIdAndRelation(id: string, rel: string) {
    return this.findOne({
      where: { id },
      relations: [rel],
    });
  }
  async findAllOrders(status?: string, userId?: string) {
    return this.find({ where: { userId, status }, relations: ['orderItems'] });
  }
  async findOrderById(id: string) {
    return this.findOne({ where: { id }, relations: ['orderItems'] });
  }

  async findOrderByOrderId(id:string){
    return this.findOne({
      where: { id }
    });
  }
}
