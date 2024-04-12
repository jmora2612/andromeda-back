import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginValidation } from '../validations/AuthValidation';
import { Response } from 'express';
import { URLS } from 'src/shared/urls/libs/urls';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from 'src/shared/guard/andromeda-guard.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(URLS.login)
  async login(@Body() login: LoginValidation, @Res() res: Response) {
    await this.authService
      .login(login)
      .then((result: any) => {
        const response = {
          status: 'success',
          data: result,
          message: 'Usuario logeado de forma exitosa.',
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
  @Get(URLS.refreshToken)
  async refreshToken(@Headers() headers, @Res() res: Response) {
    await this.authService
      .refreshToken(headers)
      .then((result) => {
        const response = {
          status: 'Registro exitoso',
          data: result,
          message: 'Refresh del token exitoso.',
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
