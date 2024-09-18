import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { InvoiceItemDto } from './invoice-item.dto';
import { InvoiceType } from '../enum/Invoice.enum';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'نوع فاکتور', enum: InvoiceType })
  @IsEnum(InvoiceType)
  type: InvoiceType;

  @ApiProperty({ type: [InvoiceItemDto], description: 'فهرست آیتم‌های فاکتور' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}
