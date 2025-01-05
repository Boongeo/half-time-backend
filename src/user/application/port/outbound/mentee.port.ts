import { Mentee } from '../../../../mentee/entity/mentee.entity';
import { User } from '../../../infrastructure/entity/user.entity';

export interface MenteePort {
  createProfile(
    user: User,
    interestNames: string[],
    introduction: string,
  ): Promise<Mentee>;
}
