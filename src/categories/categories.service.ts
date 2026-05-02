import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './repositories/categoryRepository';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly catRepoCus: CategoryRepository, private readonly common: CommonService) { }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    //   // Check if category already exists
    const existingCategory = await this.catRepoCus.findCategoryByName(name);

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }
    const createdCat = await this.catRepoCus.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    await this.catRepoCus.save(createdCat);

    return {
      message: 'Category created successfully',
      createdCat,
    };
  }

  async findAllCategories() {
    const categories = await this.catRepoCus.findAllCategories();
    return {
      message: 'Categories retrieved successfully',
      categories,
      total: categories.length,
    };
  }

  async findCategoryById(id: string) {
    const category = await this.catRepoCus.findCategoryById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      category,
    };
  }

  async updateCategory(id: string, updateCategoryDto: CreateCategoryDto, req: any) {
    const beforeChange = await this.catRepoCus.findCategoryById(id)
    if (updateCategoryDto.name) {
      const existingCategory = await this.catRepoCus.findCategoryByName(
        updateCategoryDto.name,
      );

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category name already taken');
      }
    }

    await this.catRepoCus.update(id, updateCategoryDto);
    const category = await this.catRepoCus.findCategoryById(id)
    req.changes = this.common.combineDiffBeforeAfter(beforeChange, category)
    return {
      message: 'Category updated successfully',
      category,
    };
  }

  async deleteCategory(id: string) {
    // Check if category exists
    await this.findCategoryById(id);
    // Check if category has products
    const categoryWithProducts = await this.catRepoCus.findCategoryById(id);

    // TODO : after making produce make this
    // if (categoryWithProducts && categoryWithProducts. > 0) {
    //   throw new ConflictException('Cannot delete category with existing products');
    // }

    await this.catRepoCus.delete({
      id,
    });
    return {
      message: 'Category deleted successfully',
    };
  }
}
