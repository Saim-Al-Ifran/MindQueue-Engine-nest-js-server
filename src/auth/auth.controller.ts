import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Login successful' };
  }

  @Post('refresh-token')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = req.cookies['refreshToken'];
    if (!token) return { message: 'No refresh token found' };

    const { accessToken } = this.authService.refreshToken(token);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    return { message: 'Access token refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }
}
