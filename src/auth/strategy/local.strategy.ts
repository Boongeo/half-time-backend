import { PassportStrategy } from '@nestjs/passport';

// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }
//
//   async validate(username: string, password: string): Promise<User> {
//     return this.authService.validateUser(username, password);
//   }
// }