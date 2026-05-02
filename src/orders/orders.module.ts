import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders';
import { OrderItems } from './entities/orderItems';
import { Product } from 'src/products/entities/product';
import { ProductRepository } from 'src/products/repositories/productRepository';
import { OrderRepository } from './repositories/orderRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItems, Product])],
  providers: [OrdersService, ProductRepository, OrderRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
