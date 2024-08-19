import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 40)
  @ApiProperty({ type: 'string', maxLength: 40, minLength: 2, required: true, example: '' })
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(10, 100)
  @ApiPropertyOptional({ type: 'string', maxLength: 100, minLength: 10, example: '' })
  address: string;
}
