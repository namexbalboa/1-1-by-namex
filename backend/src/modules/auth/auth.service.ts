import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  async validateFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      console.error('Error validating Firebase token:', error);
      return null;
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord | null> {
    try {
      const user = await admin.auth().getUser(uid);
      return user;
    } catch (error) {
      console.error('Error getting user by UID:', error);
      return null;
    }
  }
}
