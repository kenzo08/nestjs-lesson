import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService){}

  @Get('get-all')
  getUsers(){
    return this.userService.getUsers()
  }
}
