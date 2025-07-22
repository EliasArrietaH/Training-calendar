import { Controller, Post, Body } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service'
@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('google')
  async handleGoogleAuth(@Body('code') code: string) {
    return this.googleAuthService.exchangeCodeForToken(code);
  }
}