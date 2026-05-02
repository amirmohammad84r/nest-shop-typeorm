import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Coupons } from '../entities/coupon';

@Injectable()
export class CouponsRepository extends Repository<Coupons> {
  constructor(private dataSource: DataSource) {
    super(Coupons, dataSource.createEntityManager());
  }
  async findCouponByCode(code: string) {
    return this.findOneBy({ code });
  }
  async findAllCoupon() {
    return this.find();
  }
  async findCouponById(id: string) {
    return this.findOneBy({ id });
  }
}
