import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class RelatedProductDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  childProductId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer', example: '' })
  quantity: number;
}
