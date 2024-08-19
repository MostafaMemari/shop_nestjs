import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 40)
  @ApiProperty({ type: 'string', maxLength: 40, minLength: 2, required: true, example: '' })
  name: string;

  @IsEmail({ host_whitelist: ['gmail.com', 'yahoo.com'] })
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', example: '' })
  email: string;

  @IsPhoneNumber('IR')
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', example: '' })
  phone: string;
}
