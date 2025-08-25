import { UserResponseDto } from '@app/common/dtos';
import { Exclude, Expose } from 'class-transformer';

export class AuthResponseDto extends UserResponseDto {
  @Expose()
  accessToken: string;
}
