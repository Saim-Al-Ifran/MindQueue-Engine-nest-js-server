import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/role.guards';
import { UserRole } from '../common/enums';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getById(req.user.userId);
  }

  @Patch('me')
  updateMe(@Req() req, @Body() body: any) {
    return this.usersService.update(req.user.userId, body);
  }

  @Patch('me/password')
  changePassword(@Req() req, @Body() body: any) {
    return this.usersService.changePassword(req.user.userId, body);
  }
}
