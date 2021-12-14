import { CacheModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { Duration } from 'luxon';
import { ApiController } from './api.controller';
import { OrayApiService } from './oray-api/oray-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST', 'localhost'),
        port: config.get('REDIS_PORT', 6379),
        ttl: Duration.fromDurationLike({ day: 30 }).as('seconds'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ApiController],
  providers: [OrayApiService],
})
export class ApiModule {}
