import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice,  } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus, InvoiceType, ItemStatus } from './enum/Invoice.enum';


@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem) private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { type, items } = createInvoiceDto;
    const invoice = new Invoice();
    let status = InvoiceStatus.SUCCESS;

    const invoiceItems = await Promise.all(items.map(async (item) => {
      const product = await this.productRepository.findOne({ where: { dkpc: item.dkpc } });
      const invoiceItem = new InvoiceItem();
      
      if (!product) {
        invoiceItem.status = ItemStatus.FAILED;
        invoiceItem.product_name = 'Unknown product';
        invoiceItem.price = 0;
        invoiceItem.quantity = item.ordered_count;
        status = InvoiceStatus.PARTIAL_SUCCESS;
        return invoiceItem;
      }

      if (type === InvoiceType.PURCHASE) {
        product.quantity += item.ordered_count; 
      } else if (type === InvoiceType.SALE || type === InvoiceType.STOCK || type === InvoiceType.DAMAGED) {
        if (product.quantity < item.ordered_count) {
          invoiceItem.status = ItemStatus.FAILED;
          invoiceItem.product_name = product.name;
          invoiceItem.price =  0;
          invoiceItem.quantity = item.ordered_count;
          status = InvoiceStatus.PARTIAL_SUCCESS;
          return invoiceItem;
        }
        product.quantity -= item.ordered_count; 
      }

      invoiceItem.product_name = product.name;
      invoiceItem.price = 0;
      invoiceItem.quantity = item.ordered_count;
      invoiceItem.status = ItemStatus.SUCCESS;
      
      await this.productRepository.save(product);
      return invoiceItem;
    }));

    invoice.items = await this.invoiceItemRepository.save(invoiceItems);
    invoice.total_amount = invoice.items.reduce((sum, item) => sum + (item.status === ItemStatus.SUCCESS ? item.price * item.quantity : 0), 0);
    invoice.status = status;
    invoice.type = type;

    return await this.invoiceRepository.save(invoice);
  }

  async getInvoice(id: number): Promise<Invoice> {
    return await this.invoiceRepository.findOne({ where: { id }, relations: ['items'] });
  }
}
