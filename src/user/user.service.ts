import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';
import { User } from './dto/user';
import { CreateUserDto } from './dto/create-user.request';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService, private auth: AuthService) {
    this.db.getDatabase().registerModel(User);
  }

  public async createUser(user: CreateUserDto): Promise<User> {
    const result = await this.auth.register({
      email: user.email,
      password: user.password,
    });
    const theUser = CreateUserDto.convertToUser(result.uid, user);

    try {
      await this.db.getDatabase().getModel(User).create(theUser);
    } catch (e) {
      await this.auth.deleteAuth({ uid: result.uid });
      throw e;
    }
    return theUser;
  }

  public async getToken(email: string) {
    const result = await this.auth.login({ email });

    return { token: result.slice(0, result.length - 1) };
  }
}
