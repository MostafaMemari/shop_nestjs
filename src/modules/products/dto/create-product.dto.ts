import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, Max, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ type: 'string', required: true, example: 'Sample Product' })
  name: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(10000)
  @Max(1000000)
  @ApiPropertyOptional({ type: 'integer', example: 100 })
  price?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: 'integer', example: 10 })
  quantity?: number;

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
