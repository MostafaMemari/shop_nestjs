import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
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
import { QueryRunner, Repository } from 'typeorm';
import { ProductType } from './enum/productType.enum';
import { RelatedProduct } from './entities/related-product.entity';
import { RelatedProductDto } from './dto/related-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

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
        await this.handleCombinationProducts(queryRunner, product, relatedProducts);
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

  async update(
    id: number,
    user: User,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ): Promise<{ message: string }> {
    const { type, relatedProducts, sellerId, colorId, categoryId, ...resDto } = updateProductDto;

    const queryRunner = this.productRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const product = await this.findOneById(id, user);

    let imageLocation = product?.image;
    let imageKey = product?.image_key;
    try {
      if (image) {
        if (product.image) {
          await this.awsService.deleteFile(product.image);
        }
        const uploadImageResult = await this.awsService.uploadFile(image, 'product');
        imageLocation = uploadImageResult.Location;
        imageKey = uploadImageResult.Key;
      }

      const updatedProduct = this.productRepository.merge(product, {
        ...resDto,
        seller: { id: sellerId },
        color: { id: colorId },
        category: { id: categoryId },
        image: imageLocation || product?.image,
        image_key: imageKey || product?.image_key,
        type,
      });

      await this.updateCombinationProducts(queryRunner, updatedProduct, relatedProducts, type);

      await queryRunner.manager.save(updatedProduct);

      await queryRunner.commitTransaction();
      return { message: ProductsMessage.UpdatedProductSuccess };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (image) {
        await this.awsService.deleteFile(product.image);
      }

      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
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

  private async handleCombinationProducts(
    queryRunner: QueryRunner,
    parentProduct: Product,
    relatedProducts: RelatedProductDto[],
  ) {
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
        parentProduct,
        childProduct,
        quantity: relatedProduct.quantity,
      });
      await queryRunner.manager.save(combination);
    }
  }

  private async updateCombinationProducts(
    queryRunner: QueryRunner,
    parentProduct: Product,
    relatedProducts: RelatedProductDto[] | null,
    type: ProductType,
  ) {
    if (type && type !== ProductType.SINGLE) {
      if (!relatedProducts || relatedProducts.length === 0) {
        throw new BadRequestException('Combination products require child products');
      }
    }

    if (type && type === ProductType.SINGLE) {
      const relatedProducts = await this.relatedProductRepository.find({
        where: { parentProduct: { id: parentProduct.id } },
      });
      console.log(relatedProducts);
      if (relatedProducts.length > 0) {
        for (const relatedProduct of relatedProducts) {
          await queryRunner.manager.remove(relatedProduct);
        }
      }
      return;
    }

    if (relatedProducts) {
      const existingCombinations = await this.relatedProductRepository.find({
        where: { parentProduct: { id: parentProduct.id } },
        relations: ['childProduct'],
      });
      const existingProductIds = existingCombinations.map((combination) => combination.childProduct.id);
      const newProductIds = relatedProducts.map((relatedProduct) => relatedProduct.childProductId);
      // حذف محصولات ترکیبی که دیگر در لیست جدید نیستند
      const combinationsToRemove = existingCombinations.filter(
        (combination) => !newProductIds.includes(combination.childProduct.id),
      );
      if (combinationsToRemove.length > 0) {
        for (const combination of combinationsToRemove) {
          await queryRunner.manager.remove(combination); // حذف کامل رکورد
        }
      }
      // افزودن محصولات ترکیبی جدید
      for (const relatedProduct of relatedProducts) {
        if (!existingProductIds.includes(relatedProduct.childProductId)) {
          const childProduct = await this.productRepository.findOne({
            where: { id: relatedProduct.childProductId },
          });
          if (!childProduct) {
            throw new BadRequestException(`Child product with ID ${relatedProduct.childProductId} not found`);
          }
          const newCombination = this.relatedProductRepository.create({
            parentProduct,
            childProduct,
            quantity: relatedProduct.quantity,
          });
          await queryRunner.manager.save(newCombination);
        }
      }
      // به‌روزرسانی مقادیر (مانند quantity) برای محصولات ترکیبی موجود
      for (const relatedProduct of relatedProducts) {
        const existingCombination = existingCombinations.find(
          (combination) => combination.childProduct.id === relatedProduct.childProductId,
        );
        if (existingCombination) {
          existingCombination.quantity = relatedProduct.quantity;
          await queryRunner.manager.save(existingCombination);
        }
      }
    }
  }
}
