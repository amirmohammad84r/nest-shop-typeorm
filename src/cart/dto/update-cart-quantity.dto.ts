import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartQuantityDto {
  @ApiProperty({
    example: 3,
    description: 'New quantity (minimum 1)',
    minimum: 1
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
