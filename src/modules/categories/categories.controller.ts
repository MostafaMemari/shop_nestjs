import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('categories')
@ApiTags('Category')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.CategoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    console.log(`get all categories ${Date.now().toLocaleString('fa-ir')}`);

    return this.CategoriesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.CategoriesService.findOneById(+id);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.CategoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.CategoriesService.remove(+id);
  }
}
