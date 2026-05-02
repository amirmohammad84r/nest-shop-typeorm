import { IsString, MinLength, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'uuid-of-product',
    description: 'Product ID'
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 5,
    description: 'Rating (1-5 stars)',
    minimum: 1,
    maximum: 5
  })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot exceed 5' })
  rating: number;

  @ApiProperty({
    example: 'Great product! Highly recommended.',
    description: 'Comment text'
  })
  @IsString()
  @MinLength(10, { message: 'Comment must be at least 10 characters long' })
  comment: string;
}
