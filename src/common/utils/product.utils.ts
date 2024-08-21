import { BadRequestException } from '@nestjs/common';
import { TransactionType } from 'src/modules/transactions/enum/transaction-type.enum';
import { ProductsMessage } from '../enums/messages.enum';
import { Product } from 'src/modules/products/entities/product.entity';

export function adjustProductQuantity(product: Product, quantity: number, type: TransactionType) {
  if (type === TransactionType.DAMAGE || type === TransactionType.SALE) {
    if (product.quantity < quantity) {
      throw new BadRequestException(ProductsMessage.SaleExceedsStock);
    }
    product.quantity -= quantity;
  } else if (type === TransactionType.PURCHASE) {
    product.quantity += quantity;
  }
}
