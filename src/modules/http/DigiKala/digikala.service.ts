import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { VariantsType } from './types/query.type';

@Injectable()
export class DigikalaService {
  private readonly baseUrl = 'https://seller.digikala.com/api/v1';

  constructor(private readonly httpService: HttpService) {}

  async getVariants(authToken: string, queryParams?: VariantsType): Promise<any> {
    try {
      const url = `${this.baseUrl}/variants/`;

      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            authorization: authToken,
          },
          params: queryParams,
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error fetching variants',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateVariant(authToken: string, variantId: string, data: any): Promise<any> {
    try {
      const url = `${this.baseUrl}/variants/${variantId}/`;

      const response: AxiosResponse = await lastValueFrom(
        this.httpService.put(url, data, {
          headers: { authorization: authToken },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error updating variant',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders(authToken: string, queryParams?: Record<string, any>): Promise<any> {
    try {
      const url = `${this.baseUrl}/orders/`;

      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(url, {
          headers: { authorization: authToken },
          params: queryParams,
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error fetching orders',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getProductDigiKalaByDKP(dkp: number): Promise<any> {
    try {
      const url = `https://api.digikala.com/v2/product/${dkp}/`;
      console.log(url);

      const response: AxiosResponse = await lastValueFrom(this.httpService.get(url));

      console.log(response);

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error fetching orders',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getProductNotBuyBoxBySeller() {
    const varinats = await this.getVariants(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6MTA4NjgsInBheWxvYWQiOm51bGx9.gZAiguu0btiWXBobziPizvqDlklVxraKom6EG3I1fnvO99wYb0cECSaMiQb2hf_n',
      {
        size: 100,
        'search[is_buy_box_winner]': 0,
      },
    );

    const products = varinats?.data?.items;
    let data = [];

    for (const product of products) {
      data.push({
        dkp: product.id,
        dkpc: product.product.id,
        shippingTime: product.dk_lead_time,
        referencePrice: product.price.reference_price,
        sellingPrice: product.price.selling_price,
        isBuyBox: product.extra.buy_box.is_buy_box_winner,
        buyBoxPrice: product.extra.buy_box.buy_box_price,
      });
    }
    return data;
  }
}
