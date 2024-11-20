import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '../enums/token-type.enum';

export class EmailResDto {
  @ApiProperty({ required: true })
  email: string;
}

export class EmailExistsResDto {
  @ApiProperty({ required: true })
  exists: boolean;
}

export class AfterVerifyResDto {
  @ApiProperty({ required: true })
  message: string;
}

export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class SigninResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class RefreshResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class Payload {
  @ApiProperty({ required: true })
  sub: string;

  @ApiProperty({ required: true })
  tokenType: TokenType;
}
