import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { ProductRepository } from './repositories/productRepository';

@Injectable()
export class ProductsService {
  constructor(private readonly proRepo: ProductRepository) { }

  async createProduct(createProductDto: CreateProductDto, file) {
    const product = await this.proRepo.create({
      title: createProductDto.title,
      price: createProductDto.price,
      stock: createProductDto.stock,
      category: { id: createProductDto.categoryId },
      imgs: file.path
    });
    await product.save();

    return {
      message: 'Product created successfully',
      product,
    };
  }

  async findAllProducts(search?: string, categoryId?: string, limit?: number) {
    const where: any = { limit: limit };
    // Add search filter
    if (search) {
      where.title = Like(`%${search}%`);
    }
    // Add category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await this.proRepo.findAllProducs(where);

    return {
      message: 'Products retrieved successfully',
      products,
      total,
      filters: { search, categoryId, limit },
    };
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    //   // Check if name is being updated and if it's already taken
    if (updateProductDto.title) {
      const existingCategory = await this.proRepo.findProductById(id);

      if (existingCategory) {
        throw new ConflictException('Category name already taken');
      }
    }

    const category = await this.proRepo.update(id, {
      title: updateProductDto.title,
      price: updateProductDto.price,
      stock: updateProductDto.stock,
      category: { id: updateProductDto.categoryId },
    });

    return {
      message: 'Category updated successfully',
      category,
    };
  }

  async deleteProduct(id: string) {
    // Check if product exists
    await this.proRepo.findProductById(id);
    await this.proRepo.delete({ id });
    return {
      message: 'Product deleted successfully',
    };
  }
}
