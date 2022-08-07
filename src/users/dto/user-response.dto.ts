import { Exclude, Transform } from 'class-transformer';

export class UserResponseDtoWithHash {
  id: string;
  login: string;
  password: string;
  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;
}

export class UserResponseDto extends UserResponseDtoWithHash {
  @Exclude()
  password: string;

  constructor(withoutPass: Omit<UserResponseDto, 'password'>) {
    super();
    Object.assign(this, withoutPass);
  }
}
