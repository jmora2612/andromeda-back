import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { authDTO } from 'src/shared/dtos/libs/authDTO';

/**
 * @method UsersValidation()
 * Este Dto, es el encargado de validar la actualizacion de usuario
 */

export class UsersValidation extends PartialType(authDTO) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @MinLength(5)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  phone: string;
}

export class UsersUpdateValidation extends PartialType(authDTO) {
  @IsString()
  @MaxLength(1000)
  @MinLength(5)
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  @MaxLength(11)
  @MinLength(11)
  phone?: string;
}
