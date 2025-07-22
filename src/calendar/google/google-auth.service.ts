import { Injectable, HttpException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  async exchangeCodeForToken(code: string) {
    try {
      const res = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      return res.data; // Contiene access_token, refresh_token, expires_in, etc.
    } catch (error: any) {
      this.logger.error('Error exchanging code:', error.response?.data || error.message);
      throw new HttpException('Error exchanging code', 500);
    }
  }
}