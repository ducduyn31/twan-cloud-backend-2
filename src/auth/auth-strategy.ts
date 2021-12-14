import { Observable } from 'rxjs';

export interface AuthStrategy<AuthOptions, Result, Criteria> {
  login(options: AuthOptions): any | Promise<any> | Observable<any>;

  /**
   * register an user to db
   * @param options
   */
  register(options: AuthOptions): Result | Promise<Result> | Observable<Result>;

  /**
   * delete an existing user
   * @param options how to identify the user
   * @return user unique id and info
   */
  delete(
    options: Partial<AuthOptions>,
  ):
    | any
    | Promise<any>
    | Observable<any>
    | null
    | Promise<null>
    | Observable<null>;

  verifyLogin(criteriaToken: Criteria): any | Observable<any> | Promise<any>;
}
