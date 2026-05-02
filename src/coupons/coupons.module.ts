import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupons } from './entities/coupon';
import { CouponsRepository } from './repositories/couponRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Coupons])],
  providers: [CouponsService, CouponsRepository],
  controllers: [CouponsController],
})
export class CouponsModule {}
