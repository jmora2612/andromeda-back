import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';
import { URLS } from 'src/shared/urls/libs/urls';
import { UsersService } from '../service/users.service';
import {
  UsersUpdateValidation,
  UsersValidation,
} from '../validations/UsersValidation';
import { AuthGuard } from 'src/shared/guard/andromeda-guard.guard';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({})
  @ApiBody({ type: UsersValidation })
  @Post(URLS.createUsers)
  async create(@Body() createdUsers: UsersValidation, @Res() res: Response) {
    await this.usersService
      .create(createdUsers)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario creado de forma exitosa.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @Get(URLS.listUsers)
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getUsers(@Query() request, @Res() res: Response) {
    await this.usersService
      .findAll(request)
      .then((result) => {
        const response = {
          status: 'Registro exitoso, ¡Gracias por participar!',
          skip: result.skip,
          limit: result.limit,
          count: result.count,
          data: result.data,
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @Put(URLS.updateUsers)
  async update(
    @Param('id') _id: string,
    @Body() updateValidation: UsersUpdateValidation,
    @Res() res: Response,
  ) {
    await this.usersService
      .update(_id, updateValidation)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message:
            'Usuario actualizado de forma exitosa, ¡Gracias por participar!',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @Get(URLS.searchUsers)
  async findOne(@Param('id') _id: string, @Res() res: Response) {
    await this.usersService
      .findOne(_id)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario encontrado.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }

  @ApiBearerAuth('JWT-authenticate')
  @ApiOperation({})
  @Get(URLS.searchUsersByEmail)
  async findUserByEmail(@Param('email') email: string, @Res() res: Response) {
    await this.usersService
      .findUserByEmail(email)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario encontrado.',
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: 'error',
          message: error,
        };
        res.status(500).send(response);
      });
  }
}
