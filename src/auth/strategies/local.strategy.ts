import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Matches the custom field name for username
      passwordField: 'password', // Matches the custom field name for password
    });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateUser(email, password);
    // if(!user){
    //     throw new UnauthorizedException("Invalid Credentials")
    // }
    // return user;
  }
}
