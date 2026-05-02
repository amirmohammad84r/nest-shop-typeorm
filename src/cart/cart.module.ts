import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from './entities/cart';
import { Cart_Items } from './entities/cartItems';
import { Product } from 'src/products/entities/product';
import { CartRepository } from './repositories/cartRepository';
import { Cart_ItemsRepository } from './repositories/cartItemsRepository';
import { ProductRepository } from 'src/products/repositories/productRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Carts, Cart_Items, Product])],
  providers: [CartService, CartRepository, Cart_ItemsRepository,ProductRepository],
  controllers: [CartController],
})
export class CartModule {}
