import { DataSource } from 'typeorm';
import { Category } from './categories/entities/category';
import { Product } from './products/entities/product';
import { User } from './user/entities/user';
import { Order } from './orders/entities/orders';
import { Carts } from './cart/entities/cart';
import { Coupons } from './coupons/entities/coupon';
import { Addresses } from './addresses/entities/adresses';
import { Comments } from './comments/entities/comment';
import { OrderItems } from './orders/entities/orderItems';
import { Cart_Items } from './cart/entities/cartItems';
import { Payments } from './payments/entities/payment';
import { Permitions } from './user/entities/permitions';
import { RolesTable } from './user/entities/role';
import { Logs } from './logs/entities/logTable';
import * as dotenv from 'dotenv';
import { LogConfig } from './logs/entities/logConfig';
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
process.env.DB_TYPE = isTest ? 'sqlite' : 'postgres'
console.error(process.env.NODE_ENV)

export const AppDataSource = new DataSource(
  {
    type: process.env.DB_TYPE as any,

    database: isTest
      ? ':memory:'
      : process.env.DB_NAME,

    host: isTest ? undefined : process.env.DB_HOST,
    port: isTest ? undefined : Number(process.env.DB_PORT),

    username: isTest ? undefined : process.env.DB_USER,
    password: isTest ? undefined : process.env.DB_PASS,

    synchronize: true,
    logging: !isTest,

    dropSchema: isTest,

    entities: [
      Category,
      Product,
      User,
      Order,
      OrderItems,
      Coupons,
      Addresses,
      Comments,
      Carts,
      Cart_Items,
      Payments,
      Permitions,
      RolesTable,
      Logs,
      LogConfig
    ],

  });
