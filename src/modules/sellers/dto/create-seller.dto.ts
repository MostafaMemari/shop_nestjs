import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 40)
  @ApiProperty({ type: 'string', maxLength: 40, minLength: 2, required: true, example: '' })
  name: string;

  @IsEmail({ host_whitelist: ['gmail.com', 'yahoo.com'] })
  @IsNotEmpty()
  @ApiPropertyOptional({ type: 'string', example: '' })
  email: string;

  @IsPhoneNumber('IR')
  @IsNotEmpty()
  @ApiPropertyOptional({ type: 'string', example: '' })
  phone: string;
}
