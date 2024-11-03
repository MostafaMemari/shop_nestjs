import { Injectable } from '@nestjs/common';
import { User } from 'aws-sdk/clients/budgets';
import { CreateProductDto } from '../products/dto/product.dto';
import { ProductsService } from '../products/products.service';
import axios from 'axios';
import { AwsService } from '../aws/aws.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductRepository } from '../products/repository/products.repository';
import { sleep } from 'src/common/utils/functions';
import { ColorsRepository } from '../colors/colors.repository';

@Injectable()
export class SaveProductService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly awsService: AwsService,
    private readonly productRepository: ProductRepository,
    private readonly colorRepository: ColorsRepository,
  ) {}
  async createProductsByJson(user: User, products: any) {
    for (const product of products) {
      const {
        title: name = null,
        count: quantity = null,
        dkp = null,
        height = null,
        width = null,
        dkpc = null,
      } = product;

      let colorId: number | null = null;
      // let sellerId: number | null = null;
      // let categoryId: number | null = null;
      // if (product.category && product.category['$oid'] === '659d50260a0cab7d46c062b5') categoryId = 1;
      // if (product.category && product.category['$oid'] === '64e4e4377434bf42d07fce21') categoryId = 2;

      if (product.color && product.color['$oid'] === '658e8a513225cc8ffa5033dc') colorId = 3; // مشکی
      if (product.color && product.color['$oid'] === '658e894f5c10f33a3ed1ea84') colorId = 1; // سفید
      if (product.color && product.color['$oid'] === '658e89545c10f33a3ed1ea88') colorId = 6; // قرمز
      if (product.color && product.color['$oid'] === '658e895b5c10f33a3ed1ea8a') colorId = 4; // طلایی
      if (product.color && product.color['$oid'] === '65918d51ac9a89603bb8d7b6') colorId = 5; // چند رنگ

      // if (product.seller && product.seller['$oid'] === '659d50a50a0cab7d46c062d2') sellerId = 5;
      // if (product.seller && product.seller['$oid'] === '659b3079515a00a19937fc78') sellerId = 1;

      const porductDB = await this.productRepository.findOneBy({ dkp });

      if (porductDB) {
        porductDB.colorId = Number(colorId);
        porductDB.height = Number(height);
        porductDB.width = Number(width);
      }
      // this.productsService.create(user, {
      //   name,
      //   quantity,
      //   dkp,
      //   height,
      //   width,
      //   dkpc,
      //   colorId,
      //   sellerId,
      //   categoryId,
      // } as CreateProductDto);
    }
  }
  async createProductApiDigiKala(user: User) {
    for (let i = 1; i <= 13; i++) {
      const res = await axios.get(`https://seller.digikala.com/api/v1/variants/?page=${i}`, {
        headers: {
          authorization:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6OTM1NiwicGF5bG9hZCI6bnVsbH0.C-tez7a3F18k-XkwcYlGn-riYSbhlUj_EUrrUVY085ECuSB4rhbBn27zA7dCp32v',
        },
      });

      const { pager, items } = res.data.data;

      for (const item of items) {
        const dkpc = item.id;
        const dkp = item.product.id;
        const name = item.product.title;
        const sellerId = 1;
        const categoryId = 1;
        const imageUrl = item.product.image;

        const { Location, Key } = await this.awsService.downloadAndUploadImage(imageUrl, `products/${dkp}.jpg`);

        await this.productRepository.insert({
          dkpc,
          dkp,
          name,
          sellerId,
          categoryId,
          image: Location,
          image_key: Key,
        });
      }
    }
  }
  async updateProductsByJson(user: User, products: any) {
    for (const product of products) {
      const {
        title: name = null,
        count: quantity = null,
        dkp = null,
        height = null,
        width = null,
        dkpc = null,
      } = product;

      let colorId: number | null = null;
      // let sellerId: number | null = null;
      // let categoryId: number | null = null;
      // if (product.category && product.category['$oid'] === '659d50260a0cab7d46c062b5') categoryId = 1;
      // if (product.category && product.category['$oid'] === '64e4e4377434bf42d07fce21') categoryId = 2;

      if (product.color && product.color['$oid'] === '658e8a513225cc8ffa5033dc') colorId = 3; // مشکی
      if (product.color && product.color['$oid'] === '658e894f5c10f33a3ed1ea84') colorId = 1; // سفید
      if (product.color && product.color['$oid'] === '658e89545c10f33a3ed1ea88') colorId = 6; // قرمز
      if (product.color && product.color['$oid'] === '658e895b5c10f33a3ed1ea8a') colorId = 4; // طلایی
      if (product.color && product.color['$oid'] === '65918d51ac9a89603bb8d7b6') colorId = 5; // چند رنگ
      if (product.color && product.color['$oid'] === '658e89515c10f33a3ed1ea86') colorId = 2; // زرد

      // if (product.seller && product.seller['$oid'] === '659d50a50a0cab7d46c062d2') sellerId = 5;
      // if (product.seller && product.seller['$oid'] === '659b3079515a00a19937fc78') sellerId = 1;

      const porductDB = await this.productRepository.findOneBy({ dkp });
      console.log(porductDB, product);

      if (porductDB) {
        // porductDB.colorId = Number(colorId);
        porductDB.height = Number(height);
        porductDB.width = Number(width);
        await this.productRepository.save(porductDB);
      }
      // this.productsService.create(user, {
      //   name,
      //   quantity,
      //   dkp,
      //   height,
      //   width,
      //   dkpc,
      //   colorId,
      //   sellerId,
      //   categoryId,
      // } as CreateProductDto);
    }
  }

  async updateProductApiDigiKala(user: User) {
    const initialRes = await axios.get(`https://seller.digikala.com/api/v1/variants/?page=1`, {
      headers: {
        authorization:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6OTM1NiwicGF5bG9hZCI6bnVsbH0.C-tez7a3F18k-XkwcYlGn-riYSbhlUj_EUrrUVY085ECuSB4rhbBn27zA7dCp32v',
      },
    });

    const { pager } = initialRes.data.data;
    const totalPages = pager.total_page; // تعداد کل صفحات

    for (let i = totalPages; i >= 1; i--) {
      const res = await axios.get(`https://seller.digikala.com/api/v1/variants/?page=${i}`, {
        headers: {
          authorization:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6OTM1NiwicGF5bG9hZCI6bnVsbH0.C-tez7a3F18k-XkwcYlGn-riYSbhlUj_EUrrUVY085ECuSB4rhbBn27zA7dCp32v',
        },
      });

      const { items } = res.data.data;

      for (const item of items) {
        const dkpc = item.id;
        const dkp = item.product.id;
        const name = item.product.title;
        const sellerId = 1;
        const imageUrl = item.product.image;
        const categoryId = item.product.category_id;
        const price = item.price.selling_price;

        const existingProduct = await this.productRepository.findOne({ where: { dkp } });

        if (existingProduct) {
          existingProduct.categoryId = categoryId;
          existingProduct.price = price;

          await this.productRepository.save(existingProduct);
        } else {
          const { Location, Key } = await this.awsService.downloadAndUploadImage(imageUrl, `products/${dkp}.jpg`);

          await this.productRepository.insert({
            dkpc,
            dkp,
            name,
            sellerId,
            categoryId,
            price,
            image: Location,
            image_key: Key,
          });
        }
      }

      // مکث 1 ثانیه‌ای بین درخواست‌ها
      await sleep(1000);
    }
  }

  async updateProductColorApiDigiKala() {
    const products = await this.productRepository.find({
      where: [{ color: null }, { width: null }, { height: null }],
      order: { updated_at: 'ASC' },
    });

    for (const product of products) {
      const productDB = await this.productRepository.findOneBy({ dkp: product.dkp });
      const res = await axios.get(`https://api.digikala.com/v2/product/${product.dkp}/`);

      const description = res.data.data?.product?.review?.description;
      if (description) {
        const colorMatch = description.match(/رنگ\s+(\S+)/);
        const color = colorMatch ? colorMatch[1] : null;

        const dimensionsMatch = description.match(/ابعاد\s*(\d+)\s*(?:در|x|X)\s*(\d+)\s*سانتی\s*متر/);
        const height = dimensionsMatch ? dimensionsMatch[1] : null;
        const width = dimensionsMatch ? dimensionsMatch[2] : null;

        if (color) {
          const colorExist = await this.colorRepository.findOneBy({ name: color });
          if (colorExist) {
            productDB.colorId = colorExist.id;
          }
        }
        if (height && !isNaN(height)) {
          productDB.height = height;
        }
        if (width && !isNaN(width)) {
          productDB.width = width;
        }

        console.log(color, height, width);

        await this.productRepository.save(productDB);

        await sleep(5000);
      }
    }
  }
}
