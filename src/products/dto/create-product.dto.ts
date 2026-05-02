import { IsString, MinLength, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'Product title'
  })
  @IsString()
  @MinLength(2, { message: 'Product title must be at least 2 characters long' })
  title: string;

  @ApiProperty({
    example: 999.99,
    description: 'Product price (must be positive)'
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with max 2 decimal places' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Product stock quantity (must be non-negative)'
  })
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @ApiPropertyOptional({
    example: 'cm1234567890abcdef',
    description: 'Category ID (optional)'
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
