import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Payments } from '../entities/payment';

@Injectable()
export class PaymentRepository extends Repository<Payments> {
  constructor(private dataSource: DataSource) {
    super(Payments, dataSource.createEntityManager());
  }
  async findPaymentByOrderId(id:string){
    return this.findOne({where:{orderId:id}})
  }
  async findAllPays(){
    return this.find()
  }
  async findPayById(id:string){
    return this.findOneBy({id})
  }
}
