import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function FilterProduct() {
  return applyDecorators(ApiQuery({ name: 'search', required: false }));
}
