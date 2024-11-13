import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductType } from '../enum/productType.enum';
import { ParseJsonPipe } from 'src/common/pipes/parse-Json .pipe';
import { RelatedProductDto } from './related-product.dto';
import { IsRequiredIfTypeNotSingle } from 'src/common/decorators/requiredIfTypeNotSingle.decorator';

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ type: 'string', required: true, example: '' })
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(10000)
  @Max(1000000)
  @ApiPropertyOptional({ type: 'integer', example: '' })
  price?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: 'integer', example: '' })
  stock?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  height?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  width?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer', example: '' })
  dkp: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer', example: '' })
  dkpc: number;

  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @ApiPropertyOptional()
  status: boolean;

  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @ApiPropertyOptional()
  is_robot: boolean;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ type: 'integer', required: true, example: '' })
  sellerId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  colorId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  categoryId?: number;

  @IsNotEmpty()
  @IsEnum(ProductType)
  @ApiProperty({ type: 'enum', enum: ProductType, example: ProductType.SINGLE })
  type: ProductType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelatedProductDto)
  @ApiPropertyOptional({ type: RelatedProductDto, isArray: true })
  @Transform(({ value }) => {
    const parsedValue = new ParseJsonPipe().transform(value);
    return plainToClass(RelatedProductDto, parsedValue);
  })
  @IsRequiredIfTypeNotSingle({ message: 'relatedProducts is required when type is not SINGLE' })
  relatedProducts?: RelatedProductDto[];
}

export class FilterProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  sellerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  colorId: number;

  @ApiPropertyOptional()
  @IsOptional()
  quantityMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  quantityMax?: number;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  quantityOrder?: 'asc' | 'desc';
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// @ApiPropertyOptional({ isArray: true, type: Number, required: false })
// @IsOptional()
// @Transform(({ value }) => {
//   if (typeof value === 'string') {
//     return value
//       .split(',')
//       .map((item) => Number(item.trim()))
//       .filter((item) => !isNaN(item));
//   } else if (Array.isArray(value)) {
//     return value.map((item) => Number(item)).filter((item) => !isNaN(item));
//   }
//   return [];
// })
// composite_components?: number[];
