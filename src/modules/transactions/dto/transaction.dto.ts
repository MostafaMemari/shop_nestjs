import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { TransactionType } from '../enum/transaction-type.enum';
import { Param } from '@nestjs/common';

export class CreateTransactionDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(10000)
  @Max(1000000)
  @ApiPropertyOptional({ type: 'integer', example: 100000 })
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @ApiProperty({ type: 'integer', example: 10 })
  quantity: number;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class TransactionTypeDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}
