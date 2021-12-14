import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { map, Observable, tap } from 'rxjs';
import { LoginResponse } from './interfaces/login-response.interface';

@Injectable()
export class OrayApiService {
  private readonly USER_API_SERVER = 'https://user-api-v2.oray.com/';
  private readonly AUTH_API_SERVER = 'https://auth-v2.oray.com/';
  private readonly PGY_API_SERVER = 'https://pgy-api.oray.com/';

  constructor(
    private http: HttpService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post(
        `authorization?r=${Math.random()}`,
        {
          account: username,
          password: password,
          ismd5: true,
        },
        {
          baseURL: this.USER_API_SERVER,
        },
      )
      .pipe(
        map((response) => response.data),
        tap((response) => this.cache.set(username, JSON.stringify(response))),
      );
  }
}
