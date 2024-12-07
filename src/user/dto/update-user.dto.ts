import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  id: string;
}

export class DeleteUserDto {
  @IsNotEmpty()
  id: string;
}
