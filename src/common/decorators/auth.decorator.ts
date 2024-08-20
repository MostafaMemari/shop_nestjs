import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

export function AuthDecorator() {
  return applyDecorators(ApiBearerAuth('Authorization'), UseGuards(JwtAuthGuard));
}
