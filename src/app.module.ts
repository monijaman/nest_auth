import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './users/schemas/user.schema';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://monir:oviBason*1@cluster0.hxn3i.mongodb.net/auth?retryWrites=true&w=majority',
      {
        dbName: 'auth',
      },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    AuthModule, // Replace with your MongoDB connection string
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', // Use a strong secret key for JWT
      signOptions: { expiresIn: '60m' }, // Token expiration time
    }),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
