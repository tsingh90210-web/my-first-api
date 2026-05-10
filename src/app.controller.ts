import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  createUser(@Body() body: { email: string; name?: string }) {
    return this.appService.createUser(body.email, body.name);
  }

  @Get('users')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.appService.getUserById(Number(id));
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() body: { email?: string; name?: string }) {
    return this.appService.updateUser(Number(id), body.email, body.name);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(Number(id));
  }
}


