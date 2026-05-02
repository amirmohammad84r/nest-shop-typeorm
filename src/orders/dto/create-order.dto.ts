import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    example: 'cm1234567890abcdef',
    description: 'Product ID',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of product',
  })
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({
    type: [OrderItemDto],
    description: 'List of order items',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
