import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseApp.auth().verifyIdToken(token);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return this.firebaseApp.auth().getUser(uid);
  }
}
