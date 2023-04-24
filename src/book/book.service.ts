import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  // find all books
  async findAll() {
    return await this.prisma.book.findMany({
      select: {
        title: true,
        type: true,
        readings: true,
      },
    });
  }

  // find one function
  async findOne(id: number) {
    return await this.prisma.book.findUnique({
      select: {
        title: true,
        type: true,
        readings: true,
      },
      where: {
        id,
      },
    });
  }
  async findTypes(type: string) {
    return await this.prisma.book.findMany({
      select: {
        title: true,
        type: true,
        readings: true,
      },
      where: {
        type,
      },
    });
  }
}
