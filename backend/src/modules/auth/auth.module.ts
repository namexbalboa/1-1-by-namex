import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { initializeFirebase } from '../../config/firebase.config';
import { Tenant, TenantSchema } from '@/schemas/tenant.schema';
import { Collaborator, CollaboratorSchema } from '@/schemas/collaborator.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase' }),
    ConfigModule,
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: Collaborator.name, schema: CollaboratorSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseStrategy,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        return initializeFirebase(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
