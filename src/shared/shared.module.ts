import { Module } from '@nestjs/common';
import { AuthGuard } from '../guards/auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthStrategy } from '../firebase/firebase-auth-strategy';
import { DatabaseService } from '../database/database.service';
import { FirebaseMetadataStorageProvider } from '../firebase/interfaces/storage/firebase-metadata-storage.interface';

@Module({
  providers: [
    FirebaseMetadataStorageProvider,
    DatabaseService.forFirebase(),
    AuthService.forStrategy(new FirebaseAuthStrategy()),
    AuthGuard,
  ],
  exports: [DatabaseService, AuthService, AuthGuard],
})
export class SharedModule {}
