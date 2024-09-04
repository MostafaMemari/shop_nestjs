import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ConfirmPassword } from 'src/common/decorators/password.decorators';

export class RegisterDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Invalid username' })
  @Length(6, 30)
  @ApiProperty({
    type: 'string',
    maxLength: 40,
    minLength: 2,
    required: true,
    uniqueItems: true,
    example: '',
  })
  username: string;

  @IsEmail({ host_whitelist: ['gmail.com', 'yahoo.com'] })
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    // format: 'gmail',
    required: true,
    uniqueItems: true,
    example: '',
  })
  email: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    minLength: 2,
    required: true,
    uniqueItems: true,
    example: '',
  })
  first_name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    minLength: 2,
    required: true,
    uniqueItems: true,
    example: '',
  })
  last_name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  // @MaxLength(30)
  // @MinLength(8)
  @Length(8, 30)
  @ApiProperty({
    type: 'string',
    maxLength: 30,
    minLength: 8,
    required: true,
    example: '',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', example: '' })
  @ConfirmPassword('password')
  confirm_password: string;
}
