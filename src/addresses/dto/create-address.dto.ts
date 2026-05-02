import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'New York',
    description: 'City name',
  })
  @IsString()
  @MinLength(2, { message: 'City name must be at least 2 characters long' })
  city: string;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Street address',
  })
  @IsString()
  @MinLength(5, {
    message: 'Street address must be at least 5 characters long',
  })
  street: string;

  @ApiProperty({
    example: '10001',
    description: 'Postal code',
  })
  @IsString()
  @MinLength(3, { message: 'Postal code must be at least 3 characters long' })
  postalCode: string;
}
