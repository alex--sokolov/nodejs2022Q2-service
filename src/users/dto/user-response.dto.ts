import {Exclude, Transform} from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;

  @Exclude()
  password: string;
  version: number;

  @Transform(({ value }) => Math.floor(new Date(value).getTime() / 100))
  createdAt: Date;

  @Transform(({ value }) => Math.floor(new Date(value).getTime() / 100))
  updatedAt: Date;

  constructor(withoutPass: Omit<UserResponseDto, 'password'>) {
    Object.assign(this, withoutPass);
  }
}
