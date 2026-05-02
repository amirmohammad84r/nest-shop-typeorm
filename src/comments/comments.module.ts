import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment';
import { Product } from 'src/products/entities/product';
import { CommentsRepository } from './repositories/commentRepository';
import { ProductRepository } from 'src/products/repositories/productRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Product])],
  providers: [CommentsService, CommentsRepository, ProductRepository],
  controllers: [CommentsController],
})
export class CommentsModule {}
