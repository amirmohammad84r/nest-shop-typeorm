import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entities/payment';
import { PaymentRepository } from './repositories/paymentRepo';
import { OrderRepository } from 'src/orders/repositories/orderRepository';

@Module({
  imports:[TypeOrmModule.forFeature([Payments])],
  providers: [PaymentsService,PaymentRepository,OrderRepository],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
