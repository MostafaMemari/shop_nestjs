import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'MostafaMemari',
  })
  identifier: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'M@o6945500',
  })
  password: string;
}
