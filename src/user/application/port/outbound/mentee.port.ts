import { Mentee } from '../../../../mentee/infrastructure/entity/mentee.entity';
import { User } from '../../../infrastructure/entity/user.entity';

// 핵사고날 아키텍처를 구현하기 위해 Port를 통한 inject 구현해야함
export interface MenteePort {
  createProfile(
    user: User,
    interestNames: string[],
    introduction: string,
  ): Promise<Mentee>;
}
