import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ type: 'string', required: true, example: 'Sample Product' })
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(10000)
  @Max(1000000)
  @ApiPropertyOptional({ type: 'integer', example: 100000 })
  price?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: 'integer', example: 10 })
  quantity?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: 10 })
  height?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: 10 })
  width?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer', example: 533190 })
  dkp: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer', example: 576139 })
  dkpc: number;

  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @ApiPropertyOptional()
  status: boolean;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ type: 'integer', required: true, example: 1 })
  sellerId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: 2 })
  colorId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: 3 })
  categoryId?: number;
}

export class FilterProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
