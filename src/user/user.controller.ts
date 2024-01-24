import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('getAllCustomer/:id')
  findAll(@Param('id') id :string) {
    return this.userService.findAll(id);
  }

  @Post('updateCustomer')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Post('deleteCustomer')
  remove(@Body() id: any) {
    return this.userService.remove(id);
  }

  @Post('createAddress')
  createAddress(@Body() address: AddressDto) {
    return this.userService.createAddress(address);
  }
}
