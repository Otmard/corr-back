import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from './firebase-admin.service';
import * as admin from 'firebase-admin';
import serviceAccount from '../config/admin-firebase.json';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        });
      },
    },
    FirebaseAdminService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseAdminService],
})
export class FirebaseAdminModule {}
