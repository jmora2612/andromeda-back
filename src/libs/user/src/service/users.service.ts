import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { authDTO } from 'src/shared/dtos/libs/authDTO';
import { Users } from '../schemas/Users.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private usersModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  async create(register: authDTO) {
    const { name, email, password, phone } = register;
    const phoneValidation = phone.length;
    if (+phoneValidation < 11)
      throw 'El numero de teléfono debe tener mínimo 11 digitos.';

    if (+phoneValidation > 11)
      throw 'El numero de teléfono debe tener máximo 11 digitos.';

    const salt = bcrypt.genSaltSync();
    const findOne = await this.usersModel.findOne({
      $or: [{ name }, { email }],
    });

    register.password = bcrypt.hashSync(password, salt);

    if (findOne?.email === email) throw 'Ya existe un registro con este email.';

    if (+findOne?.phone === +phone)
      throw 'Ya existe un registro con este número de teléfono.';

    const saveUser = await new this.usersModel(register).save();
    const token = await this.createToken({
      _id: saveUser._id,
      name: saveUser.name,
    }).catch((error) => {
      throw { error, status: HttpStatus.BAD_REQUEST };
    });

    return {
      _id: token.user._id,
      name: token.user.name,
      token: token.access_token,
    };
  }

  async findAll(request) {
    const query = {};
    const { name, email, skip, limit } = request;
    if (name) {
      query['name'] = name;
    }
    if (email) {
      query['email'] = email;
    }

    const [findUsers, totalCount] = await Promise.all([
      this.usersModel.find(query).skip(Number(skip)).limit(Number(limit)),
      this.usersModel.countDocuments(query),
    ]);

    return findUsers.length
      ? { data: findUsers, skip: skip, limit: limit, count: totalCount }
      : (() => {
          throw 'No hay usuarios disponibles.';
        })();
  }

  async update(id, users: authDTO) {
    const { name, email, phone, password } = users;
    if (phone) {
      const phoneValidation = phone.length;
      if (+phoneValidation < 11)
        throw 'El numero de teléfono debe tener mínimo 11 digitos.';

      if (+phoneValidation > 11)
        throw 'El numero de teléfono debe tener máximo 11 digitos.';
    }

    const findOne = await this.usersModel.findOne({ _id: id });
    const salt = bcrypt.genSaltSync();
    if (password)
      users = { ...users, password: bcrypt.hashSync(password, salt) };

    if (findOne) {
      const findOneUsers = await this.usersModel.findOne({
        $or: [{ name }, { email }, { phone }],
        _id: { $ne: id },
      });

      if (findOneUsers) {
        if (findOneUsers?.email === email)
          throw 'Ya existe un registro con este email.';
        if (+findOneUsers?.phone === +phone)
          throw 'Ya existe un registro con este número de teléfono.';
      }

      return await this.usersModel
        .findByIdAndUpdate(id, users, { new: true })
        .exec();
    } else {
      throw 'No existe el registro solicitado.';
    }
  }

  async findOne(id) {
    const findUsers = await this.usersModel.findOne({ _id: id });

    return findUsers
      ? findUsers
      : (() => {
          throw 'El registro solicitado no existe.';
        })();
  }

  async findUserByEmail(email) {
    const findUsers = await this.usersModel.findOne({ email });
    return findUsers
      ? findUsers
      : (() => {
          throw 'El correo ingresado no existe.';
        })();
  }

  async createToken(payload) {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    return { access_token, user: payload };
  }
}
