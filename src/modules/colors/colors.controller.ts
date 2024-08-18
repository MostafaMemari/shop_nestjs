import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('colors')
@ApiTags('Color')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.findOneById(+id);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(+id, updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.remove(+id);
  }
}
