import {
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
