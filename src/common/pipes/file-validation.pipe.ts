import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize: number,
    private readonly allowedTypes: string[],
    private readonly isFileRequired: boolean,
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      if (this.isFileRequired) {
        throw new BadRequestException('File is required');
      }
      return null;
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(`File size should not exceed ${this.maxSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${this.allowedTypes.join(', ')}`);
    }

    return file;
  }
}
