import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}


async validateUser(username: string, password: string): Promise<any> {
  const user = await this.usersService.findOne(username) as UserDocument;
  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...result } = user.toJSON(); // Use toJSON() after casting to UserDocument
    return result;
  }
  return null;
}

  

async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
