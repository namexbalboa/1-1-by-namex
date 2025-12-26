import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const initializeFirebase = (configService: ConfigService) => {
  const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
  const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
  const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');

  if (!projectId || !privateKey || !clientEmail) {
    console.warn('⚠️  Firebase credentials not configured. Authentication will not work.');
    return null;
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });
  }

  return admin;
};

export { admin };
