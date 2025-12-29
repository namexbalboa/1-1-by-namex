import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const firebaseUser = await this.authService.validateFirebaseToken(token);

    if (!firebaseUser) {
      throw new UnauthorizedException('Invalid Firebase token');
    }

    // Fetch collaborator data to include role and other info
    const collaborator = await this.authService.getCollaboratorByFirebaseUid(firebaseUser.uid);

    if (!collaborator) {
      throw new UnauthorizedException('Collaborator not found or inactive');
    }

    // Return user object with collaborator data (including role)
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      collaboratorId: collaborator._id.toString(),
      role: collaborator.role,
      tenantId: collaborator.tenantId,
      name: collaborator.name,
    };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
