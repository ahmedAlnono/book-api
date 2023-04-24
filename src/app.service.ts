import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Auth, Signin } from './dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Response } from 'express';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  //signin function
  async signin(dto: Signin, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    try {
      if (await argon.verify(user.hash, dto.password)) {
        delete user.hash;
        res.redirect(`http://localhost:3000/user/${user.id}`);
        return user;
      } else {
        throw new ForbiddenException('wrong password', {
          cause: new Error('password not valid'),
        });
      }
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }

  // signup function
  async signup(dto: Auth, res: Response) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      res.redirect(`http://localhost:3000/user/${user.id}`);
      return user;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }
}
