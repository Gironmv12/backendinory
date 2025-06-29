import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { User, AuthAccount } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterEmailDto } from './dto/register-email.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @ApiOperation({ summary: 'Login with email' })
  @ApiResponse({ status: 200, description: 'Successfully logged in', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginEmailDto })
  async loginEmail(@Body() dto: LoginEmailDto): Promise<AuthResponseDto> {
    return this.authService.loginEmail(dto);
  }

  @Post('login/google')
  @ApiOperation({ summary: 'Login with google' })
  @ApiResponse({ status: 200, description: 'Successfully logged in', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginGoogleDto })
  async loginGoogle(@Body() dto: LoginGoogleDto): Promise<AuthResponseDto> {
    return this.authService.loginWithGoogle(dto);
  }

  @Post('register/email')
  @ApiOperation({ summary: 'Register with email' })
  @ApiResponse({ status: 200, description: 'Successfully registered', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({ type: RegisterEmailDto })
  async registerEmail(@Body() dto: RegisterEmailDto): Promise<AuthResponseDto> {
    return this.authService.registerEmail(dto);
  }
}
