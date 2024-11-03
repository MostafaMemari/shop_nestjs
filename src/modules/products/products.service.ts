import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsMessage } from 'src/common/enums/messages.enum';
import { User } from '../users/entities/user.entity';
import { productSettingsDto } from './dto/product-settings.dto';
import { ProductSettingsRepository } from './repository/product-settings.repository';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SellerService } from '../sellers/sellers.service';
import { AwsService } from '../aws/aws.service';
import { paginationSolver } from 'src/common/utils/pagination.util';
import { ProductRepository } from './repository/products.repository';
import { TransactionType } from '../transactions/enum/transaction-type.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ProductSettingsRepository: ProductSettingsRepository,
    private readonly sellerService: SellerService,
    private readonly awsService: AwsService,
  ) {}

  async create(user: User, createProductDto: CreateProductDto, image: Express.Multer.File): Promise<string> {
    const { sellerId } = createProductDto;

    await this.sellerService.findOneById(sellerId, user);

    const { Location, Key } = await this.awsService.uploadFile(image, 'product-test');

    try {
      await this.productRepository.createProduct(createProductDto, { Location, Key });
      return ProductsMessage.CreatedProductSuccess;
    } catch (error) {
      await this.awsService.deleteFile(Location);
      throw new InternalServerErrorException(ProductsMessage.FailedCreateProduct);
    }
  }
  async createAndUpdateProductSettings(id: number, productSettingsDto: productSettingsDto, user: User) {
    const product = await this.findOneByIdAndRelationSetting(id, user);
    const isCreated = !product.product_settings;
    await this.ProductSettingsRepository.createAndUpdateProductSettings(id, product, productSettingsDto);

    return {
      message: isCreated ? ProductsMessage.CreateProductSettingsSuccess : ProductsMessage.UpdateProductSettingsSuccess,
    };
  }

  async findAll(user: User, filterDto: FilterProductDto, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { search, colorId, categoryId, sellerId } = filterDto;

    return await this.productRepository.findUserProducts(user, {
      limit,
      page,
      skip,
      search,
      colorId,
      categoryId,
      sellerId,
    });
  }
  async findAllSetting(user: User, filterDto: FilterProductDto, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { search } = filterDto;

    return this.productRepository.findUserProductsSetting(user, { limit, page, skip, search });
  }
  async findAllByTransactionType(
    user: User,
    type: TransactionType,
    filterDto: FilterProductDto,
    paginationDto: PaginationDto,
  ) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { search, colorId, categoryId, sellerId, quantityMin, quantityMax, quantityOrder } = filterDto;

    return await this.productRepository.findUserProductsReport(user, {
      limit,
      page,
      skip,
      search,
      type,
      colorId,
      categoryId,
      sellerId,
      quantityMin,
      quantityMax,
      quantityOrder,
    });
  }

  async findOneById(id: number, user: User) {
    const product = await this.productRepository.findUserProductById(id, user);
    if (!product) throw new NotFoundException(ProductsMessage.NotFoundProduct);
    return product;
  }

  async update(id: number, user: User, updateProductDto: UpdateProductDto, image: Express.Multer.File) {
    const { sellerId } = updateProductDto;

    console.log(updateProductDto, image);

    //* Validate seller
    sellerId && (await this.sellerService.findOneById(updateProductDto.sellerId, user));

    //* Find Product
    const product = await this.findOneById(id, user);

    this.productRepository.merge(product, updateProductDto);
    await this.productRepository.save(product);

    return {
      message: ProductsMessage.UpdatedProductSuccess,
    };
  }

  async remove(id: number, user: User) {
    const product = await this.findOneById(id, user);
    await this.productRepository.remove(product);

    return {
      message: ProductsMessage.RemoveProductSuccess,
    };
  }

  async findOneByIdAndRelationSetting(id: number, user: User) {
    const product = await this.productRepository.findOneByIdAndRelationSetting(id, user);
    if (!product) throw new NotFoundException(ProductsMessage.NotFoundProduct);
    return product;
  }
}
