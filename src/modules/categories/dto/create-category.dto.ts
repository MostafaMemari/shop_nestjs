import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({
    maxLength: 50,
    minLength: 2,
    type: 'string',
    required: true,
    uniqueItems: true,
    example: '',
  })
  name: string;
}
