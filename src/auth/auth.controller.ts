import { Controller, Get, Query } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  @Get('verify-token')
  async verifyToken(@Query('token') token: string) {
    return this.firebaseAdminService.verifyToken(token);
  }
}
