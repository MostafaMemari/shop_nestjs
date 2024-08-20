import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ValidateIdsPipe } from './pipe/validate-ids.pipe';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

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

  @Get()
  findAll(@GetUser() user: User) {
    return this.productsService.findAll(user);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.findOneById(+id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.remove(+id, user);
  }
}
