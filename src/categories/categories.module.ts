import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { CategoryRepository } from './repositories/categoryRepository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CommonModule],
  providers: [CategoriesService, CategoryRepository],
  controllers: [CategoriesController],
})
export class CategoriesModule { }
