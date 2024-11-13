import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsMessage } from 'src/common/enums/messages.enum';
import { User } from '../users/entities/user.entity';
import { productSettingsDto } from './dto/settings-product.dto';
import { ProductSettingsRepository } from './repository/product-settings.repository';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SellerService } from '../sellers/sellers.service';
import { AwsService } from '../aws/aws.service';
import { paginationSolver } from 'src/common/utils/pagination.util';
import { ProductRepository } from './repository/products.repository';
import { TransactionType } from '../transactions/enum/transaction-type.enum';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './enum/productType.enum';
import { RelatedProduct } from './entities/related-product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ProductSettingsRepository: ProductSettingsRepository,
    private readonly sellerService: SellerService,
    private readonly awsService: AwsService,

    @InjectRepository(RelatedProduct)
    private relatedProductRepository: Repository<RelatedProduct>,
  ) {}

  async createProduct(user: User, createProductDto: CreateProductDto, image: Express.Multer.File): Promise<string> {
    const { sellerId, colorId, categoryId, type, relatedProducts } = createProductDto;

    await this.sellerService.findOneById(sellerId, user);

    const { Location, Key } = await this.awsService.uploadFile(image, 'product');

    const queryRunner = this.productRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        seller: { id: sellerId },
        color: { id: colorId },
        category: { id: categoryId },
        image: Location,
        image_key: Key,
      });
      await queryRunner.manager.save(product);

      if (type !== ProductType.SINGLE) {
        if (!relatedProducts || relatedProducts.length === 0) {
          throw new BadRequestException('Combination products require child products');
        }
        for (const relatedProduct of relatedProducts) {
          const childProduct = await this.productRepository.findOne({
            where: { id: relatedProduct.childProductId },
          });
          if (!childProduct) {
            throw new BadRequestException(`Child product with ID ${relatedProduct.childProductId} not found`);
          }

          const combination = this.relatedProductRepository.create({
            parentProduct: product,
            childProduct,
            quantity: relatedProduct.quantity,
          });
          await queryRunner.manager.save(combination);
        }
      }

      await queryRunner.commitTransaction();
      return ProductsMessage.CreatedProductSuccess;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.awsService.deleteFile(Location);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async create(user: User, createProductDto: CreateProductDto, image: Express.Multer.File): Promise<string> {
    const { sellerId } = createProductDto;

    await this.sellerService.findOneById(sellerId, user);

    const { Location, Key } = await this.awsService.uploadFile(image, 'product');

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
    return await this.productRepository.findUserProductsReport(user, type, filterDto, paginationDto);
  }

  async findOneById(id: number, user: User) {
    const product = await this.productRepository.findUserProductById(id, user);
    if (!product) throw new NotFoundException(ProductsMessage.NotFoundProduct);
    return product;
  }

  async update(id: number, user: User, updateProductDto: UpdateProductDto, image: Express.Multer.File) {
    let { sellerId } = updateProductDto;

    //* Validate seller
    if (sellerId) {
      await this.sellerService.findOneById(sellerId, user);
    }

    //* Find Product
    const product = await this.findOneById(id, user);

    // const updateData: Partial<Product> = {
    //   ...updateProductDto,
    // };

    // this.productRepository.merge(product, updateData);
    // await this.productRepository.save(product);

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
