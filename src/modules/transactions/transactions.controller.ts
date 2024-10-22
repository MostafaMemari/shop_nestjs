import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionTypeDto, UpdateTransactionDto } from './dto/transaction.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TransactionType } from './enum/transaction-type.enum';
import { FilterProductDto } from '../products/dto/product.dto';

@Controller('transactions')
@ApiTags('Transactions')
@AuthDecorator()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/product/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(
    @Param('id', ParseIntPipe) productId: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.create(+productId, createTransactionDto, user);
  }

  @Get('/report/:type')
  @ApiParam({ name: 'type', enum: TransactionType })
  getReportByType(
    @Param('type') type: TransactionType,
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterProductDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.generateReportByType(user, type, paginationDto, filterDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.transactionsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
