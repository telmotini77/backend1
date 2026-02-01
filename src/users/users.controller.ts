import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only admin can create users via this endpoint
  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Only admin can list all users
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // Admins can get any user; users can get their own profile
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { userId?: string; role?: string } },
  ) {
    const requester = req.user;
    if (requester.role !== 'admin' && requester.userId !== id) {
      throw new ForbiddenException();
    }
    const user = await this.usersService.findOneById(id);
    return user;
  }

  // Only admin can update users
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Only admin can delete users
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
