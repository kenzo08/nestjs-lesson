import { Injectable } from '@nestjs/common';
import { data } from '../mocks/index'

@Injectable()
export class UsersService {
    getUsers(){
        return data
    }
}
