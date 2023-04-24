import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { wish } from 'src/dto/wish.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  userData(@Param('id') id: string) {
    return this.userService.userData(id);
  }

  @Post(':id/add/book')
  addBook(@Param('id') id: number, @Body() dto: wish) {
    return this.userService.addBook(+id, dto);
  }

  @Post(':id/add/wish/:book')
  addWish(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
  ) {
    return this.userService.addWish(+id, +book);
  }

  @Post(':id/add/read/:book')
  addRead(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
  ) {
    return this.userService.addRead(+id, +book);
  }

  @Post(':id/update/book/:book')
  updateBook(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
    @Body() dto: wish,
    @Body('password') password: string,
  ) {
    return this.userService.updateBook(id, book, dto, password);
  }

  @Delete(':id/remove/book/:book')
  removeBook(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
    @Body('password') password: string,
  ) {
    return this.userService.removeBook(id, book, password);
  }
  @Delete(':id/remove/wish/:book')
  removeWish(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
    @Body('password') password: string,
  ) {
    return this.userService.removeWish(id, book, password);
  }
  @Delete(':id/remove/read/:book')
  removeRead(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('book', new ParseIntPipe()) book: number,
    @Body('password') password: string,
  ) {
    return this.userService.removeRead(id, book, password);
  }
}
