import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { initializeFirebase } from '../../config/firebase.config';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase' }), ConfigModule],
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
