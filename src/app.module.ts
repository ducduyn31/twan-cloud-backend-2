import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ApiModule],
  providers: [],
})
export class AppModule {}
