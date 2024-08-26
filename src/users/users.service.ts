import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    return user.save();
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password, email } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword, email });
    return newUser.save();
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOne(username) as UserDocument;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject(); // Use `toObject()` to get a plain JavaScript object
      return result;
    }
    return null;
  }
  
  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }
}
