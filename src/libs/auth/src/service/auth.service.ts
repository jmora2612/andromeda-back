import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../schemas/Auth.schema';
import { authDTO } from 'src/shared/dtos/libs/authDTO';
import { UsersService } from 'src/libs/user/src';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private usersModel: Model<Auth>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  login = async ({ email, password }) => {
    const findUsers = await this.usersService.findUserByEmail(email);

    if (!findUsers) throw 'Este correo no existe';

    const validPassword = bcrypt.compareSync(password, findUsers.password);

    if (!validPassword) throw 'Contraseña incorrecta';

    const token = await this.createToken({
      _id: findUsers._id,
      name: findUsers.name,
    }).catch((error) => {
      throw { error, status: HttpStatus.BAD_REQUEST };
    });

    return {
      _id: token.user._id,
      name: token.user.name,
      token: token.access_token,
    };
  };

  createToken = async (payload) => {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    return { access_token, user: payload };
  };

  refreshToken = async (headers) => {
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
      throw 'No se proporcionó el token JWT.';
    }
    const token = authorizationHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verify(token);
    const access_token = this.jwtService.sign(
      {
        _id: decodedToken._id,
        name: decodedToken.name,
      },
      {
        expiresIn: '2h',
      },
    );
    return {
      token: access_token,
      _id: decodedToken._id,
      name: decodedToken.name,
    };
  };
}
