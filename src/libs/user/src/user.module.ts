import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './schemas/Users.schema';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { JwtModule } from '@nestjs/jwt';
const { JWT_KEY } = process.env;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { expiresIn: '60m', algorithm: 'HS256' },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
