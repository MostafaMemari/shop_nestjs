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
}
