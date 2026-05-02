import { IsString, MinLength, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({
    example: 'SAVE20',
    description: 'Coupon code'
  })
  @IsString()
  @MinLength(3, { message: 'Coupon code must be at least 3 characters long' })
  code: string;

  @ApiProperty({
    example: 20.5,
    description: 'Discount percentage (0-100)'
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Discount must be a valid number with max 2 decimal places' })
  @Min(0, { message: 'Discount cannot be negative' })
  discountPercent: number;

  @ApiProperty({
    example: '2025-12-31T23:59:59Z',
    description: 'Expiration date (ISO string)'
  })
  @IsDateString({}, { message: 'Expiration date must be a valid ISO date string' })
  expiresAt: string;
}
