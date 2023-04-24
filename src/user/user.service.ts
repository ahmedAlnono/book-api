import { ForbiddenException, Injectable } from '@nestjs/common';
import { wish } from 'src/dto/wish.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // user data function
  async userData(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    const wishes = [];
    const books = [];
    const readings = [];
    (await user.wishes()).map((wish) => {
      wishes.push(wish);
    });
    (await user.books()).map((book) => {
      books.push(book);
    });
    (await user.readings()).map((reading) => {
      readings.push(reading);
    });
    return {
      readings,
      wishes,
      books,
    };
  }

  // add book function
  async addBook(id: number, dto: wish) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      const book = await this.prisma.book.create({
        data: {
          title: dto.title,
          body: dto.body,
          type: dto.type,
          userid: id,
        },
      });
      return book;
    } else {
      new ForbiddenException('user not found');
    }
  }

  //  add wish function
  async addWish(id: number, book: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const find_book = await this.prisma.book.findUnique({
      where: {
        id: book,
      },
    });
    if (user && find_book) {
      const wish = await this.prisma.wish.create({
        data: {
          userId: id,
          bookId: book,
        },
      });
      return wish;
    } else {
      throw new ForbiddenException('user or book not found');
    }
  }

  // add read function
  async addRead(id: number, book: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const find_book = await this.prisma.book.findUnique({
      where: {
        id: book,
      },
    });
    if (user && find_book) {
      const reading = await this.prisma.reading.create({
        data: {
          userId: id,
          bookId: book,
        },
      });
      return reading;
    } else {
      throw new ForbiddenException('uesr or book not found');
    }
  }

  // remove wish function
  async removeWish(id: number, book: number, password: string) {
    const wish = this.prisma.wish.findUnique({
      where: {
        id: book,
      },
    });
    if (wish) {
      const user = await wish.user();
      if (
        (await wish).userId == id &&
        user &&
        argon.verify(user.hash, password)
      ) {
        this.prisma.wish.delete({
          where: {
            id,
          },
        });
        return 'user deleted successfully';
      } else {
        return 'wrong user data';
      }
    } else {
      return 'book is not in wishes list';
    }
  }

  // remove read function
  async removeRead(id: number, book: number, password: string) {
    const read = this.prisma.reading.findUnique({
      where: {
        id: id,
      },
    });
    if (await read) {
      const user = await read.user();
      if (
        (await read).userId == id &&
        user &&
        argon.verify(user.hash, password)
      ) {
        this.prisma.reading.delete({
          where: {
            id,
          },
        });
        return 'user deleted successfully';
      } else {
        return 'wrong user data';
      }
    } else {
      return 'book is not in reading list';
    }
  }

  // remove book function
  async removeBook(id: number, book: number, password: string) {
    const d_book = this.prisma.book.findUnique({
      where: {
        id: book,
      },
    });
    if (d_book) {
      const user = await d_book.user();
      if (
        (await d_book).userid == id &&
        user &&
        argon.verify(user.hash, password)
      ) {
        await this.prisma.book.delete({
          where: {
            id: book,
          },
        });
      } else {
        return 'wrong user data';
      }
    } else {
      return 'book not found';
    }
  }

  // update book function
  async updateBook(id: number, book: number, dto: wish, password: string) {
    // need to add check for uesr and password
    const iBook = this.prisma.book.findUnique({
      where: {
        id: book,
      },
    });
    if (iBook) {
      const user = await iBook.user();
      if (await argon.verify(user.hash, password)) {
        const id_book = await this.prisma.book.update({
          where: {
            id: book,
          },
          data: {
            title: dto.title,
            body: dto.body,
            type: dto.type,
          },
        });
        return id_book;
      } else {
        return 'wrong password';
      }
    } else {
      throw new ForbiddenException('book not found');
    }
  }
}
