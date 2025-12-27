import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { Tenant, TenantDocument } from '@/schemas/tenant.schema';
import { Collaborator, CollaboratorDocument } from '@/schemas/collaborator.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(Collaborator.name) private collaboratorModel: Model<CollaboratorDocument>,
  ) {}

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

  async registerUser(registerDto: RegisterDto) {
    try {
      // 1. Check if email already exists in our database
      const existingCollaborator = await this.collaboratorModel.findOne({
        email: registerDto.email,
      });

      if (existingCollaborator) {
        throw new ConflictException('Email already registered in the system');
      }

      // 2. Create user in Firebase Authentication
      let firebaseUser: admin.auth.UserRecord;
      try {
        firebaseUser = await admin.auth().createUser({
          email: registerDto.email,
          password: registerDto.password,
          displayName: registerDto.name,
          emailVerified: false,
        });
      } catch (firebaseError: any) {
        if (firebaseError.code === 'auth/email-already-exists') {
          throw new ConflictException('Email already registered in Firebase');
        }
        throw new InternalServerErrorException(`Firebase error: ${firebaseError.message}`);
      }

      // 3. Extract email domain and find or create tenant
      const emailDomain = registerDto.email.split('@')[1];
      let tenant = await this.tenantModel.findOne({ emailDomain });

      if (!tenant) {
        // Create new tenant for this domain
        tenant = await this.tenantModel.create({
          name: registerDto.companyName,
          emailDomain,
          defaultLanguage: registerDto.preferredLanguage || 'pt',
          primaryColor: '#0EA5E9',
          isActive: true,
        });
      }

      // 4. Determine if this is the first user for this tenant (becomes manager)
      const collaboratorCount = await this.collaboratorModel.countDocuments({
        tenantId: tenant._id,
      });
      const isFirstUser = collaboratorCount === 0;

      // 5. Create collaborator in database
      const collaborator = await this.collaboratorModel.create({
        tenantId: tenant._id,
        firebaseUid: firebaseUser.uid,
        name: registerDto.name,
        email: registerDto.email,
        role: isFirstUser ? 'manager' : 'employee',
        preferredLanguage: registerDto.preferredLanguage || tenant.defaultLanguage,
        isActive: true,
      });

      return {
        message: 'User registered successfully',
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        },
        collaborator: {
          id: collaborator._id,
          name: collaborator.name,
          email: collaborator.email,
          role: collaborator.role,
        },
        tenant: {
          id: tenant._id,
          name: tenant.name,
        },
        isFirstUser,
      };
    } catch (error) {
      // If we created Firebase user but failed to create collaborator, clean up
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}
