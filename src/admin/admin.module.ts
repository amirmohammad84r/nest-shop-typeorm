import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user';
import { Category } from 'src/categories/entities/category';
import { Product } from 'src/products/entities/product';
import { Order } from 'src/orders/entities/orders';
import { Carts } from 'src/cart/entities/cart';
import { Addresses } from 'src/addresses/entities/adresses';
import { Coupons } from 'src/coupons/entities/coupon';
import { Payments } from 'src/payments/entities/payment';
import { UserRepository } from 'src/user/repositories/userRepository';
import { CategoryRepository } from 'src/categories/repositories/categoryRepository';
import { ProductRepository } from 'src/products/repositories/productRepository';
import { OrderRepository } from 'src/orders/repositories/orderRepository';
import { CartRepository } from 'src/cart/repositories/cartRepository';
import { AddressesRepository } from 'src/addresses/repositories/addressRepository';
import { CouponsRepository } from 'src/coupons/repositories/couponRepository';
import { PaymentRepository } from 'src/payments/repositories/paymentRepo';
import { CommentsRepository } from 'src/comments/repositories/commentRepository';
import { Comments } from 'src/comments/entities/comment';
import { Permitions } from 'src/user/entities/permitions';
import { PermitionsReposotory } from 'src/user/repositories/permitionRepository';
import { RoleRepository } from 'src/user/repositories/roleRepository';
import { RolesTable } from 'src/user/entities/role';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Category,
    Product,
    Order,
    Carts,
    Addresses,
    Coupons,
    Payments,
    Comments,
    Permitions,
    RolesTable
  ])],
  controllers: [AdminController],
  providers: [
    AdminService,
    UserRepository,
    CategoryRepository,
    ProductRepository,
    OrderRepository,
    CartRepository,
    AddressesRepository,
    CouponsRepository,
    PaymentRepository,
    CommentsRepository,
    PermitionsReposotory,
    RoleRepository
  ],
})

export class AdminModule { }
