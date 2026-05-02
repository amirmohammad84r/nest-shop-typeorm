import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findAllProducs(where?: any) {
    return this.findAndCount({
      where: {
        category: { id: where.categoryId },
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: where.limit ? parseInt(where.limit.toString()) : undefined,
    });
  }
  async findProductById(id: string) {
    return this.findOneBy({ id });
  }
}
