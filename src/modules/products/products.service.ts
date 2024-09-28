import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsMessage } from 'src/common/enums/messages.enum';
import { User } from '../users/entities/user.entity';
import { productSettingsDto } from './dto/product-settings.dto';
import { ProductsRepository } from './repository/products.repository';
import { ProductSettingsRepository } from './repository/product-settings.repository';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SellerService } from '../sellers/sellers.service';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly ProductSettingsRepository: ProductSettingsRepository,
    private readonly sellerService: SellerService,
    private readonly awsService: AwsService,
  ) {}

  async create(user: User, createProductDto: CreateProductDto, image: Express.Multer.File): Promise<string> {
    const { sellerId } = createProductDto;

    //* Validate seller
    await this.sellerService.findOneById(sellerId, user);

    //* Upload image
    const { Location, Key } = await this.awsService.uploadFile(image, 'product-test');

    try {
      //* Create product
      await this.productRepository.createProduct(createProductDto, { Location, Key });
      return ProductsMessage.CreatedProductSuccess;
    } catch (error) {
      //* If an error occurs, delete the uploaded image
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

  async findAll(user: User, paginationDto: PaginationDto, filterDto: FilterProductDto) {
    return await this.productRepository.findUserProducts(user, paginationDto, filterDto);
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
