import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({ status: 201, description: 'فاکتور با موفقیت ایجاد شد', type: Invoice })
  @ApiResponse({ status: 400, description: 'خطا در داده‌های ورودی' })
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return await this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'فاکتور با موفقیت بازیابی شد', type: Invoice })
  @ApiResponse({ status: 404, description: 'فاکتور پیدا نشد' })
  async getInvoice(@Param('id') id: number): Promise<Invoice> {
    return await this.invoiceService.getInvoice(id);
  }
}
