import { BadRequestException } from '@nestjs/common';
import { TransactionType } from 'src/modules/transactions/enum/transaction-type.enum';
import { ProductsMessage } from '../enums/messages.enum';
import { Product } from 'src/modules/products/entities/product.entity';

export function adjustProductQuantity(product: Product, quantity: number, type: TransactionType) {
  if (type === TransactionType.DAMAGE || type === TransactionType.SALE || type === TransactionType.DEPO) {
    if (product.stock < quantity) {
      throw new BadRequestException(ProductsMessage.SaleExceedsStock);
    }
    product.stock -= quantity;
  } else if (type === TransactionType.PURCHASE) {
    product.stock += quantity;
  }
}
