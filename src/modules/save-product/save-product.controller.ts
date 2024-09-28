import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { SaveProductService } from './save-product.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'aws-sdk/clients/budgets';
import * as fs from 'fs';
import { promisify } from 'util';
import { ApiTags } from '@nestjs/swagger';

const readFileAsync = promisify(fs.readFile);

@Controller('save-product')
@ApiTags('save-product')
export class SaveProductController {
  constructor(private readonly saveProductService: SaveProductService) {}

  @Get('create-products')
  async createProductsByJson(@GetUser() user: User) {
    try {
      const filePath = `${process.cwd()}/src/modules/products/product-management.products.json`;
      const products = await readFileAsync(filePath, 'utf-8');
      return this.saveProductService.createProductsByJson(user, JSON.parse(products));
    } catch (error) {
      console.error('Error reading the products file:', error);
      throw new InternalServerErrorException('Could not read products file.');
    }
  }
  @Get('create-products-api')
  async createProductApiDigiKala(@GetUser() user: User) {
    try {
      return this.saveProductService.createProductApiDigiKala(user);
    } catch (error) {
      console.error('Error reading the products file:', error);
      throw new InternalServerErrorException('Could not read products file.');
    }
  }
}
