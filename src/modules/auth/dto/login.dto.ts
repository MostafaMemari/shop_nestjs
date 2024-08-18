import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '',
  })
  identifier: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: '',
  })
  password: string;
}
