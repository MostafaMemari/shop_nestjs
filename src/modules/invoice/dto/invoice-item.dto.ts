import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class InvoiceItemDto {
  @ApiProperty({ description: 'ID محصول' })
  @IsInt()
  @IsPositive()
  dkpc: number;

  @ApiProperty({ description: 'تعداد محصول' })
  @IsInt()
  @IsPositive()
  ordered_count: number;
}
