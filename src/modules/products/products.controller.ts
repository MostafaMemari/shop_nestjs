import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ParseIntPipe,
  Put,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto/product.dto';

import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ValidateIdsPipe } from './pipe/validate-ids.pipe';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { productSettingsDto } from './dto/product-settings.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FilterProduct } from 'src/common/decorators/filter.decorator';
import * as fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

@Controller('products')
@ApiTags('Product')
@AuthDecorator()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('create-products')
  async createProductsByJson(@GetUser() user: User) {
    try {
      const filePath = `${process.cwd()}/src/modules/products/product-management.products.json`;
      const products = await readFileAsync(filePath, 'utf-8');
      return this.productsService.createProductsByJson(user, JSON.parse(products));
    } catch (error) {
      console.error('Error reading the products file:', error);
      throw new InternalServerErrorException('Could not read products file.');
    }
  }

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @UsePipes(ValidateIdsPipe)
  create(@GetUser() user: User, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(user, createProductDto);
  }

  @Patch('/:id/settings')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createAndUpdateProductSettings(
    @Param('id', ParseIntPipe) id: string,
    @Body() productSettingsDto: productSettingsDto,
    @GetUser() user: User,
  ) {
    return this.productsService.createAndUpdateProductSettings(+id, productSettingsDto, user);
  }

  @Get()
  @Pagination()
  @FilterProduct()
  findAll(@GetUser() user: User, @Query() paginationDto: PaginationDto, @Query() filterDto: FilterProductDto) {
    return this.productsService.findAll(user, paginationDto, filterDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.findOneById(+id, user);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @UsePipes(ValidateIdsPipe)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.remove(+id, user);
  }
}
