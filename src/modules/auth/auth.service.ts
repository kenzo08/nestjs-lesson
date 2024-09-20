import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { AppError } from '../../common/constants/errors';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const isUserExist = await this.userService.isUserExist(dto.email);
    if (isUserExist) throw new BadRequestException(AppError.USER_EXISTS);
    return this.userService.createUser(dto);
  }

  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    const userExist = await this.userService.isUserExist(dto.email);
    if (!userExist) throw new BadRequestException(AppError.USER_NOT_FOUND);
    const IsValidPsswrd = await bcrypt.compare(
      dto.password,
      userExist.password,
    );
    if (!IsValidPsswrd) throw new BadRequestException(AppError.WRONG_DATA);
    const userDta = {
      name: userExist.firstname,
      email: userExist.email,
    };
    const token = await this.tokenService.generateJwtToken(userDta);
    const user = await this.userService.publicUser(dto.email);
    return { ...user, token };
  }
}
