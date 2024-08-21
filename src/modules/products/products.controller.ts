import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ValidateIdsPipe } from './pipe/validate-ids.pipe';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { productSettingsDto } from './dto/product-settings.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('products')
@ApiTags('Product')
@AuthDecorator()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @UsePipes(ValidateIdsPipe)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put('/:id/settings')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createAndUpdateProductSettings(
    @Param('id', ParseIntPipe) id: string,
    @Body() productSettingsDto: productSettingsDto,
    @GetUser() user: User,
  ) {
    return this.productsService.createAndUpdateProductSettings(+id, productSettingsDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.productsService.findAll(user);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.findOneById(+id, user);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.remove(+id, user);
  }
}
