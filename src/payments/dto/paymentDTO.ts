import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDTO {
  @ApiProperty({
    example: 'cm1234567890abcdef',
    description: 'Order ID',
  })
  @IsString()
  orderId: string;

    @ApiProperty({
    example: '23',
    description: 'amount',
    })
  @IsNumber()
  amount: number;


  @ApiProperty({
    example: "bfdb",
    description: 'transactionId',
  })
  @IsString()
  @IsOptional()
  transactionId: string;
}