import { IsEmail, MinLength } from 'class-validator';
import * as md5 from 'md5';
import { User } from './user';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @MinLength(12)
  cloudUsername: string;

  @MinLength(8)
  cloudPassword: string;

  static convertToUser(userId: string, creator: CreateUserDto): User {
    return {
      id: userId,
      username: creator.cloudUsername,
      md5Password: md5(creator.cloudPassword),
    };
  }
}
