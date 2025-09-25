import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password-dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import {
  CreateUserDocs,
  DeleteUserDocs,
  FindUserByIdDocs,
  FindUserByNameDocs,
  UpdateUserPasswordDocs,
} from './decorators/users-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    @InjectMetric('create_user_requests_total')
    private readonly createUserCounter: Counter,
    @InjectMetric('update_user_password_requests_total')
    private readonly updateUserPasswordCounter: Counter,
    @InjectMetric('delete_user_requests_total')
    private readonly deleteUserCounter: Counter,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @CreateUserDocs()
  create(@Body() createUserDto: CreateUserDto) {
    this.createUserCounter.inc();
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':name')
  @FindUserByNameDocs()
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @FindUserByIdDocs()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @DeleteUserDocs()
  remove(@Param('id') id: string) {
    this.deleteUserCounter.inc();
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/password')
  @UpdateUserPasswordDocs()
  updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userPayload = req.user;
    if (!userPayload || userPayload['sub'] !== id) {
      return {
        error: 'Acesso negado.',
      };
    }
    this.updateUserPasswordCounter.inc();
    return this.usersService.updatePassword(id, updateUserPasswordDto.password);
  }
}
