import {Exclude, Transform} from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;

  @Exclude()
  password: string;
  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;

  constructor(withoutPass: Omit<UserResponseDto, 'password'>) {
    Object.assign(this, withoutPass);
  }
}
