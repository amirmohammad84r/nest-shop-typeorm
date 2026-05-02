import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({
    example: 'uuid-of-product',
    description: 'Product ID',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity (minimum 1)',
    minimum: 1,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
