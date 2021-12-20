import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthService } from '../../auth/auth.service';
import { auth } from 'firebase-admin';
import DecodedIdToken = auth.DecodedIdToken;
import { User } from '../../user/dto/user';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest().header('Authorization');
    const result: DecodedIdToken = await this.authService.verify(token);
    const authUser = await admin.auth().getUserByEmail(result.email);
    const model = this.db.getDatabase().getModel(User);
    context.switchToHttp().getRequest().user = await model.findById(
      authUser.uid,
    );
    return !!result && !!context.switchToHttp().getRequest().user;
  }
}
