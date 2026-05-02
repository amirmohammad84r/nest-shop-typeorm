import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { AddressesModule } from './addresses/addresses.module';
import { CouponsModule } from './coupons/coupons.module';
import { PaymentsModule } from './payments/payments.module';
import { CommentsModule } from './comments/comments.module';
import { AuthGuard } from './auth/auth.guard';
import { LoggingInterceptor } from './logs/logging.interceptor';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { LogsModule } from './logs/Logs.module';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitqm/rabbitqm.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    AddressesModule,
    CouponsModule,
    PaymentsModule,
    CommentsModule,
    AdminModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    LogsModule,
    CommonModule,
    RedisModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    CommonService,
  ],
})
export class AppModule { }
