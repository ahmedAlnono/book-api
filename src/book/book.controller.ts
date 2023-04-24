import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id/')
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    // @Param('type') type: string,
  ) {
    return this.bookService.findOne(+id);
  }

  @Get('type/:type')
  findTypes(@Param('type') type: string) {
    return this.bookService.findTypes(type);
  }
}
