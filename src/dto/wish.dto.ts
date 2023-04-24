import { IsNotEmpty, IsString } from 'class-validator';

export class wish {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
