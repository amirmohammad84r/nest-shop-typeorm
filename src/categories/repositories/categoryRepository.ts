import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }
  async findCategoryByName(name: string) {
    return this.findOneBy({ name });
  }
  async findAllCategories() {
    return this.find();
  }

  async findCategoryById(id: string) {
    return this.findOneBy({ id });
  }
}
