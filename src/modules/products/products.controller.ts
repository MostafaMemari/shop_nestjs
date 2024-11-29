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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ValidateIdsPipe } from './pipe/validate-ids.pipe';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { productSettingsDto } from './dto/settings-product.dto';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FilterProduct } from 'src/common/decorators/filter.decorator';

import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { TransactionType } from '../transactions/enum/transaction-type.enum';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('products')
@ApiTags('Product')
@AuthDecorator()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UsePipes(ValidateIdsPipe)
  @UseInterceptors(UploadFileS3('image'))
  async create(
    @GetUser() user: User,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.productsService.createProduct(user, createProductDto, image);
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
    return this.productsService.findAll(user, filterDto, paginationDto);
  }

  @Get('/setting')
  @Pagination()
  @FilterProduct()
  @ApiParam({ name: 'type', enum: TransactionType })
  findAllSetting(@GetUser() user: User, @Query() paginationDto: PaginationDto, @Query() filterDto: FilterProductDto) {
    return this.productsService.findAllSetting(user, filterDto, paginationDto);
  }
  @Get(':type')
  @Pagination()
  @FilterProduct()
  @ApiParam({ name: 'type', enum: TransactionType })
  findAllByTransactionType(
    @GetUser() user: User,
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterProductDto,
    @Param('type') type: TransactionType,
  ) {
    console.log(new Date().toLocaleTimeString('fa-IR'));
    return this.productsService.findAllByTransactionType(user, type, filterDto, paginationDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.findOneById(+id, user);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UsePipes(ValidateIdsPipe)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new FileValidationPipe(10 * 1024 * 1024, ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'], false),
    )
    image?: Express.Multer.File,
  ) {
    return this.productsService.update(+id, user, updateProductDto, image);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.productsService.remove(+id, user);
  }
}
