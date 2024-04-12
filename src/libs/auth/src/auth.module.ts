import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './schemas/Auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/libs/user/src';
const { JWT_KEY } = process.env;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { expiresIn: '60m', algorithm: 'HS256' },
    }),
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [MongooseModule, AuthService],
})
export class AuthModule {}
