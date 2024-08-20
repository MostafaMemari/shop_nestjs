import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SellerService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('sellers')
@ApiTags('Seller')
@AuthDecorator()
export class SellersController {
  constructor(private readonly SellerService: SellerService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createSellerDto: CreateSellerDto, @GetUser() user: User) {
    return this.SellerService.create(createSellerDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.SellerService.findAll(user);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.SellerService.findOneById(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.SellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    return this.SellerService.remove(+id, user);
  }
}
