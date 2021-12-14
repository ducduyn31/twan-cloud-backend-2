import { AuthStrategy } from '../auth/auth-strategy';
import * as admin from 'firebase-admin';
import { DateTime } from 'luxon';
import {
  DecodedIdToken,
  CreateRequest,
  UserRecord,
} from 'firebase-admin/lib/auth';

export class FirebaseAuthStrategy
  implements AuthStrategy<CreateRequest, UserRecord, string>
{
  async verifyLogin(idToken: string): Promise<DecodedIdToken | null> {
    try {
      const payload = await admin.auth().verifyIdToken(idToken, true);
      return DateTime.fromSeconds(payload.exp) >= DateTime.now()
        ? payload
        : null;
    } catch (error) {
      if (error.code == 'auth/id-token-revoked') {
        return null;
      }
    }
  }

  register(options: CreateRequest): Promise<UserRecord> {
    return admin.auth().createUser(options);
  }

  async delete(
    options: Partial<CreateRequest>,
  ): Promise<Partial<CreateRequest> | null> {
    if (!('uid' in options)) {
      throw new TypeError('Requires user UID to delete.');
    }
    try {
      await admin.auth().deleteUser(options.uid);
      return {
        uid: options.uid,
        email: options.email,
        displayName: options.displayName,
        phoneNumber: options.phoneNumber,
        photoURL: options.photoURL,
      };
    } catch (e) {
      return null;
    }
  }

  async login(options: CreateRequest): Promise<string> {
    if (!('email' in options)) {
      throw new TypeError('Requires user email to get token.');
    }

    const user = await admin.auth().getUserByEmail(options.email);

    return await admin.auth().createCustomToken(user.uid);
  }
}
