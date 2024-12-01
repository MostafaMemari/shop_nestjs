import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 40)
  @ApiProperty({ type: 'string', maxLength: 40, minLength: 2, required: true, example: '' })
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ type: 'integer', required: true, example: 1 })
  seller_id: number;

  @IsEmail({ host_whitelist: ['gmail.com', 'yahoo.com'] })
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', example: '' })
  email: string;

  @IsPhoneNumber('IR')
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', example: '' })
  phone: string;

  @IsOptional()
  @IsJWT()
  @ApiPropertyOptional({ type: 'string', example: '' })
  api_key: string;

  @IsOptional()
  @IsJWT()
  @ApiPropertyOptional({ type: 'string', example: '' })
  access_token: string;

  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @ApiPropertyOptional({ type: 'boolean', example: '' })
  is_robot: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: 'number', example: '' })
  robot_start_time: number;
}

export class UpdateSellerDto extends PartialType(CreateSellerDto) {}
