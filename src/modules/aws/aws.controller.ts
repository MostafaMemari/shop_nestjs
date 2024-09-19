import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { AwsService } from './aws.service';

@ApiTags('images')
@Controller('images')
export class awsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image to AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.awsService.uploadFile(file, file.originalname);
    return { url: imageUrl };
  }
}
