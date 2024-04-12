import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { authDTO } from 'src/shared/dtos/libs/authDTO';

/**
 * @method AuthValidation()
 * Este Dto, es el encargado de validar el registro o creacion de la aplicacion
 */

export class LoginValidation extends PartialType(authDTO) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
